import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosConfig";
import "./VNPayPayment.css";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { formatCurrencyVND } from "../../helpers/formatCurrency";

const VNPayPayment = () => {
    const [paymentUrl, setPaymentUrl] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("pending");
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const txnRef = searchParams.get("vnp_TxnRef");
    const planId = location.state?.planId || null;
    const storedPlanDetails = JSON.parse(localStorage.getItem("planDetails")) || {};
    const navigate = useNavigate();

    // Gửi yêu cầu tạo thanh toán nếu có planId
    useEffect(() => {
        if (!planId) return;

        const createPayment = async () => {
            try {
                const response = await axiosInstance.post("/create-payment/", {
                    plan_id: planId,
                });
                setPaymentUrl(response.data.paymentUrl);
            } catch (error) {
                console.error("Lỗi khi tạo URL thanh toán:", error);
                if (error.response?.status === 401) {
                    navigate("/"); // Redirect nếu lỗi 401
                }
            }
        };

        createPayment();
    }, [planId]);

    // Chuyển hướng đến VNPay nếu có paymentUrl
    useEffect(() => {
        if (paymentUrl) {
            window.location.href = paymentUrl;
        }
    }, [paymentUrl]);

    // Kiểm tra trạng thái thanh toán nếu có txnRef (VNPay redirect về)
    useEffect(() => {
        const verifyPayment = async () => {
            if (txnRef) {
                try {
                    const queryParams = new URLSearchParams(window.location.search).toString();
                    const response = await axiosInstance.get(
                        `http://localhost:8000/api/payment-return/?${queryParams}`
                    );
                    console.log("Response từ BE:", response);

                    if (response.status === 200) {
                        setPaymentStatus("success");
                    } else {
                        setPaymentStatus("failed");
                    }
                } catch (error) {
                    console.error("Lỗi kiểm tra giao dịch:", error);
                    setPaymentStatus("failed");
                }
            }
        };

        verifyPayment();
    }, [txnRef]);

    // Giao diện khi chưa chọn gói
    if (!planId && paymentStatus === "pending") {
        return (
            <div className="vnpay-payment-container">
                <h2>Bạn chưa chọn gói Premium!</h2>
                <p>Vui lòng quay lại trang Premium để chọn gói trước khi thanh toán.</p>
                <button onClick={() => window.location.href = "/premium"} className="go-back-button">
                    Quay lại chọn gói
                </button>
            </div>
        );
    }

    // Giao diện dựa trên trạng thái thanh toán
    return (
        <div className="vnpay-payment-container">
            {paymentStatus === "pending" && (
                <>
                    <h2>Đang chuẩn bị chuyển hướng đến VNPay...</h2>
                    {!paymentUrl && <p className="loading-text">Vui lòng chờ trong giây lát.</p>}
                </>
            )}

            {paymentStatus === "success" && (
                <div className="vnpay-payment-success">
                    {/* Logo Spotify */}
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                        alt="Spotify Logo"
                        style={{ width: "80px", height: "80px", marginBottom: "30px" }}
                    />

                    <h2>Thanh toán thành công!</h2>
                    <p>Cảm ơn bạn đã mua gói Premium.</p>

                    {/* Thông tin hóa đơn */}
                    <div className="vnpay-payment-invoice">
                        <div className="invoice-item">
                            <span>Gói Premium:</span>
                            <strong>{storedPlanDetails?.name}</strong>
                        </div>
                        <div className="invoice-item">
                            <span>Số tiền:</span>
                            <strong>{formatCurrencyVND(storedPlanDetails?.price)}</strong>
                        </div>
                        <div className="invoice-item">
                            <span>Mã giao dịch:</span>
                            <strong>{txnRef}</strong>
                        </div>
                        <div className="invoice-item">
                            <span>Ngày thanh toán:</span>
                            <strong>{new Date().toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}</strong>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            localStorage.removeItem("planDetails"); // Xóa dữ liệu trước khi chuyển hướng
                            window.location.href = "/";
                        }}
                    >
                        Về trang chính
                    </button>
                </div>
            )}

            {paymentStatus === "failed" && (
                <div className="vnpay-payment-failed">
                    {/* Logo Spotify */}
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                        alt="Spotify Logo"
                        style={{ width: "80px", height: "80px", marginBottom: "30px" }}
                    />

                    <h2>Thanh toán thất bại!</h2>
                    <p>Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.</p>

                    {/* Thông tin hóa đơn */}
                    <div className="vnpay-payment-invoice">
                        <div className="invoice-item">
                            <span>Gói Premium:</span>
                            <strong>{storedPlanDetails?.name}</strong>
                        </div>
                        <div className="invoice-item">
                            <span>Số tiền:</span>
                            <strong>{formatCurrencyVND(storedPlanDetails?.price)}</strong>
                        </div>
                        <div className="invoice-item">
                            <span>Mã giao dịch:</span>
                            <strong>{txnRef}</strong>
                        </div>
                        <div className="invoice-item">
                            <span>Ngày thử thanh toán:</span>
                            <strong>{new Date().toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}</strong>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            localStorage.removeItem("planDetails"); // Xóa dữ liệu trước khi chuyển hướng
                            window.location.href = "/premium";
                        }}
                    >
                        Thử lại
                    </button>
                </div>
            )}
        </div>
    );
};

export default VNPayPayment;