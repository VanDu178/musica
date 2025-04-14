import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { Send } from 'lucide-react';
import axiosInstance from "../../config/axiosConfig";
import Cookies from "js-cookie";
import axios from "axios";
import { useLocation } from "react-router-dom"; //Thêm dòng này
import { useTranslation } from 'react-i18next';

const Chat = () => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const ws = useRef(null);
    const messagesEndRef = useRef(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;
    const location = useLocation();
    const { otherUserId, otherUserName, otherUserAVT } = location.state || {};


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axiosInstance.get(`/messages/${otherUserId}/`);
                setMessages(
                    response?.data?.messages.map((msg) => ({
                        sender: msg.sender.toString(),
                        text: msg.content,
                        sent_at: msg.sent_at,
                    }))
                );
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
        scrollToBottom();

        return () => {
            setMessages([]);
        };
    }, [otherUserId]);

    const connectWebSocket = () => {
        let token = Cookies.get("access_token");
        if (!token) {
            console.error('No access token found for WebSocket');
            return;
        }

        ws.current = new WebSocket(
            `ws://${process.env.REACT_APP_DOMAIN_SOCKET}/ws/chat/?otherUserId=${otherUserId}&token=${token}`
        );

        ws.current.onopen = () => {
            console.log('WebSocket connected');
            reconnectAttempts.current = 0; // Reset khi kết nối thành công
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            console.log(otherUserId);
            if (data.type === 'chat') {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: data.sender,
                        text: data.message,
                        sent_at: data.sent_at || new Date().toISOString(),
                    },
                ]);
                scrollToBottom();
            }
        };

        ws.current.onclose = (event) => {
            console.log('WebSocket disconnected', event.code, event.reason);
            if (event.code === 1006) { // Chỉ reconnect khi token hết hạn
                handleReconnect();
            } else {
                console.log('WebSocket closed for reason other than token expiration:', event.code);
            }
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    };

    const handleReconnect = async () => {
        if (reconnectAttempts.current >= maxReconnectAttempts) {
            console.error('Max reconnect attempts reached. Please log in again.');
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            return;
        }

        const refreshToken = Cookies.get("refresh_token");
        if (!refreshToken) {
            console.error("No refresh token found.");
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            return;
        }

        try {
            reconnectAttempts.current += 1;
            console.log(`Reconnect attempt ${reconnectAttempts.current}/${maxReconnectAttempts}`);

            const { data } = await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/refresh/`,
                { refresh: refreshToken }
            );

            if (data?.access && data?.refresh) {
                Cookies.set("access_token", data.access, { expires: 0.02 }); // 30 phút
                Cookies.set("refresh_token", data.refresh, { expires: 7 });
                connectWebSocket(); // Tái kết nối với token mới
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
        }
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            ws.current?.close();
        };
    }, [otherUserId]);

    // Send a message
    const sendMessage = () => {
        if (input.trim() && ws.current?.readyState === WebSocket.OPEN) {
            const messageData = {
                message: input,
                receiver: otherUserId,
            };
            ws.current.send(JSON.stringify(messageData));
            setInput('');
            scrollToBottom();
        }
    };

    if (typeof otherUserId === 'undefined') {
        return null;
    }

    return (
        <div className="chat-container">
            <div className="chat-chatbox">
                <div className="chat-header">
                    <img
                        src={otherUserAVT || "../../images/default-avt-img.jpeg"}
                        alt="Avatar"
                        className="chat-avatar"
                        onError={(e) => {
                            e.target.onerror = null; // tránh vòng lặp nếu fallback cũng lỗi
                            e.target.src = "../../images/default-avt-img.jpeg";
                        }}
                    />
                    <div className="chat-user-info">
                        <span className="chat-username">{otherUserName !== null ? otherUserName : t("chat.nameNone")}</span>
                    </div>
                </div>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-message ${msg.sender.toString() === otherUserId ? 'bot' : 'user'}`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-input-container">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="chat-input-box"
                        placeholder="Nhập tin nhắn..."
                    />
                    <button onClick={sendMessage} className="chat-send-button">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;