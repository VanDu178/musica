import React, { useEffect, useState } from "react";
import "./Footer.css";
import { checkData } from "../../helpers/encryptionHelper";
import { useUserData } from "../../context/UserDataProvider";

const Footer = React.memo(() => {
    const [validRole, setValidRole] = useState(false);
    const { isLoggedIn } = useUserData();
    useEffect(() => {
        const fetchRole = async () => {
            if (isLoggedIn) {
                //nếu đang login thì check role phải user không
                const checkedRoleUser = await checkData(3);
                if (checkedRoleUser) {
                    setValidRole(true);
                }
            } else {
                //nếu không login thì hiển thị
                setValidRole(true);
            }
        };

        fetchRole();
    }, [isLoggedIn]);

    if (!validRole) {
        return null;
    }

    return (
        <footer className="footer-container" role="contentinfo" aria-label="footer">
            <div className="footer-wrapper" role="complementary">
                <aside className="footer-left" role="table">
                    <h4 className="footer-title" role="complementary">Công ty</h4>
                    <h6>Giới thiệu</h6>
                    <h6>Việc làm</h6>
                    <h6>For the Record</h6>
                </aside>

                <aside className="footer-center" role="table">
                    <h4 className="footer-title" role="complementary">Cộng đồng</h4>
                    <h6>Dành cho các nghệ sĩ</h6>
                    <h6>Nhà phát triển</h6>
                    <h6>Quảng cáo</h6>
                    <h6>Nhà đầu tư</h6>
                    <h6>Nhà cung cấp</h6>
                </aside>

                <aside className="footer-center" role="table">
                    <h4 className="footer-title" role="complementary">Các gói của Spotify</h4>
                    <h6>Premium Individual</h6>
                    <h6>Premium Student</h6>
                    <h6>Spotify Free</h6>
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
                <h6 className="footer-copyright">© 2025 ZiZoDac Team</h6>
            </div>
            <hr />
            <div>
                <div className="footer-redtitle">ĐÂY LÀ TRANG WEB PHỤC VỤ CHO MỤC ĐÍCH HỌC TẬP !!!</div>
            </div>
        </footer>
    );
});

export default Footer;
