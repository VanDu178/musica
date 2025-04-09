import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './RootModal.css';

const RootModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Sử dụng setTimeout để đảm bảo CSS áp dụng trước khi kích hoạt animation
            setTimeout(() => setAnimate(true), 10);
        } else {
            setAnimate(false);
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <>
            <div
                className={`rootModal-modal-overlay ${animate ? 'fade-in' : 'fade-out'}`}
                onClick={onClose}
            >
                <div className='rootModal-modal-container'>
                    <div
                        className={`rootModal-modal-content ${animate ? 'scale-in' : 'scale-out'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="rootModal-modal-left"></div>
                        <div className="rootModal-modal-text">
                            <h2>Bắt đầu nghe bằng tài khoản Z Free</h2>
                            <button
                                className="rootModal-primary-button"
                                onClick={() => { navigate(`/signup`); }}
                            >Đăng ký miễn phí</button>
                            <button className="rootModal-secondary-button">Tải ứng dụng xuống</button>
                            <p>
                                Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
                            </p>
                        </div>
                    </div>
                    <button className="rootModal-close-button" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </>
    );
};

export default RootModal;