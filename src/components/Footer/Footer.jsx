import React from "react";
import "./Footer.css";

const Footer = React.memo(() => {
    return (
        <footer className="footer-container" role="contentinfo" aria-label="footer">
            <div className="footer-wrapper" role="complementary">
                <aside className="footer-left" role="table">
                    <h4 className="footer-title" role="complementary">Công ty</h4>
                    <p>Giới thiệu</p>
                    <p>Việc làm</p>
                    <p>For the Record</p>
                </aside>

                <aside className="footer-center" role="table">
                    <h4 className="footer-title" role="complementary">Cộng đồng</h4>
                    <p>Dành cho các nghệ sĩ</p>
                    <p>Nhà phát triển</p>
                    <p>Quảng cáo</p>
                    <p>Nhà đầu tư</p>
                    <p>Nhà cung cấp</p>
                </aside>

                <aside className="footer-center" role="table">
                    <h4 className="footer-title" role="complementary">Các gói của Spotify</h4>
                    <p>Premium Individual</p>
                    <p>Premium Student</p>
                    <p>Spotify Free</p>
                </aside>

                <aside className="footer-right" role="tab">
                    <h4 className="footer-title" role="complementary">Payment</h4>
                    <img
                        className="footer-payment"
                        src="https://i.ibb.co/Qfvn4z6/payment.png"
                        alt="payment method accepted, MoMo, VNPay, Bank, ShopeePay"
                        title="payment method accepted, MoMo, VNPay, Bank, ShopeePay"
                        aria-label="payment method accepted, MoMo, VNPay, Bank, ShopeePay"
                    />
                </aside>
            </div>
            <div>
                <p className="footer-copyright">© 2025 Spotify ZiZoDac</p>
            </div>
        </footer>
    );
});

export default Footer;
