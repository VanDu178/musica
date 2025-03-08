import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import "./DeepSeekChat.css";

export default function DeepSeekChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage = { text: input, sender: "user" };
        setMessages([...messages, userMessage]);
        setInput("");

        try {
            const apiKey = "";
            const apiUrl = "https://api-inference.huggingface.co/models/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5";
            const corsProxyUrl = "https://cors-anywhere.herokuapp.com/"; // Sử dụng CORS proxy

            const response = await fetch(`${corsProxyUrl}${apiUrl}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    inputs: input
                })
            });

            if (!response.ok) {
                throw new Error("Lỗi khi gọi API Hugging Face");
            }

            const data = await response.json();
            const botMessage = { text: data[0]?.generated_text || "Không có phản hồi", sender: "bot" };
            setMessages([...messages, userMessage, botMessage]);
        } catch (error) {
            console.error("Lỗi gửi tin nhắn:", error);
            setMessages([...messages, { text: "Lỗi khi gửi tin nhắn", sender: "bot" }]);
        }
    };

    return (
        <div className="chat-container">
            {/* Sidebar */}
            <div className="chat-sidebar">
                <h2 className="chat-title">Chat với AI</h2>
                <button className="chat-menu-item">
                    <MessageCircle /> <span>Chat</span>
                </button>
            </div>

            {/* Chatbox */}
            <div className="chat-chatbox">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="chat-input-container">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="chat-input-box"
                        placeholder="Nhập tin nhắn..."
                    />
                    <button onClick={sendMessage} className="chat-send-button">
                        <Send />
                    </button>
                </div>
            </div>
        </div>
    );
}