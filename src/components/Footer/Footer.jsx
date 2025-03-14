import React from "react";
import "./Footer.css"; // Import file CSS

const Footer = React.memo(() => {
    return (
        <footer className="footer-container" role="contentinfo" aria-label="footer">
            <div className="footer-wrapper" role="complementary">
                <aside className="footer-left" role="table">
                    <h3 className="footer-title" role="complementary">Về chúng tôi</h3>
                    Spotify
                </aside>

                <aside className="footer-center" role="table">
                    <h3 className="footer-title" role="complementary">Chính sách</h3>
                </aside>

                <aside className="footer-right" role="tab">
                    <h3 className="footer-title" role="complementary">Payment</h3>
                    <img
                        className="footer-payment"
                        src="https://i.ibb.co/Qfvn4z6/payment.png"
                        alt="payment method accepted, MoMo, VNPay, Bank, ShopeePay"
                        title="payment method accepted, MoMo, VNPay, Bank, ShopeePay"
                        aria-label="payment method accepted, MoMo, VNPay, Bank, ShopeePay"
                    />
                </aside>
            </div>
        </footer>
    );
});

export default Footer;
