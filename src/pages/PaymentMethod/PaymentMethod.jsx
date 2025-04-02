import React, { useState, useEffect } from "react";
import "./PaymentMethod.css";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig"; // Import axios
import { formatCurrencyVND } from "../../helpers/formatCurrency";
import { handleError, handleSuccess } from "../../helpers/toast";
import { useUserData } from "../../context/UserDataProvider";
import Forbidden from "../../components/Error/403/403";
import { checkData } from "../../helpers/encryptionHelper";
import Loading from "../../components/Loading/Loading";
import { useTranslation } from "react-i18next";

const PaymentMethod = () => {
    const { t } = useTranslation();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [planDetails, setPlanDetails] = useState(null); // State để lưu thông tin gói Premium
    const [loading, setLoading] = useState(true); // State để theo dõi trạng thái loading
    const navigate = useNavigate();
    const location = useLocation();
    const planId = location.state?.planId || null; // Kiểm tra nếu không có gói nào được chọn
    const { isLoggedIn } = useUserData();
    const [validRole, setValidRole] = useState(false);

    useEffect(() => {
        const fetchRole = async () => {
            setLoading(true);
            if (isLoggedIn) {
                //nếu đang login thì check role phải user  không
                const checkedRoleUser = await checkData(3);

                if (checkedRoleUser) {
                    setValidRole(true);
                    setLoading(false);

                }
            }
            setLoading(false);

        };

        fetchRole();
    }, [isLoggedIn]);


    useEffect(() => {
        const fetchPlanDetails = async () => {
            try {
                setLoading(true);
                // Giả sử bạn có một API endpoint để lấy thông tin gói Premium
                const response = await axiosInstance.get(`/plans/${planId}/`); // Thay đổi URL API thực tế của bạn
                setPlanDetails(response.data);
            } catch (error) {
                console.error("Lỗi khi fetch thông tin gói Premium:", error);
            } finally {
                setLoading(false);
            }
        };

        if (planId) {
            fetchPlanDetails();
        } else {
            setLoading(false); // Nếu không có planId thì không cần fetch
        }
    }, []);

    const PaymentCash = async () => {
        if (!planId || !planDetails) {
            console.log("Không tìm thấy thông tin gói dịch vụ!");
            return;
        }

        try {
            const response = await axiosInstance.post("/cash-payment/", {
                plan_id: planId
            });

            if (response.status === 200) {
                handleSuccess("Thanh toán tiền mặt thành công!"); // Hiển thị toast thành công
                navigate("/");
            } else {
                console.log("Thanh toán thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                handleSuccess("Bạn đã tham gia Premium!"); // Hiển thị toast thành công
            } else {
                console.error("Lỗi khi xử lý thanh toán tiền mặt:", error);
            }
        }
    };

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
    };

    const handlePaymentSubmit = () => {
        if (!planId) {
            return;
        }

        if (selectedPaymentMethod === "vnpay") {
            if (localStorage.getItem("planDetails")) {
                localStorage.removeItem("planDetails");
            }
            localStorage.setItem("planDetails", JSON.stringify(planDetails));
            navigate("/payment/vnpay", {
                state: {
                    planId: planId,
                }
            });
        } else if (selectedPaymentMethod === "cash") {
            PaymentCash();
        }
        else if (selectedPaymentMethod) {
            navigate("/payment/confirmation", { state: { planId: planId, method: selectedPaymentMethod, amount: planDetails?.price, name: planDetails?.name } });
        } else {
            console.log("Vui lòng chọn phương thức thanh toán!");
        }
    };
    if (!planId) {
        return (
            <div className="PaymentMethod-container">
                <h2>Bạn chưa chọn gói Premium!</h2>
                <p>Vui lòng quay lại trang Premium để chọn gói trước khi thanh toán.</p>
                <button onClick={() => navigate("/user/premium")} className="go-back-button">
                    Quay lại chọn gói
                </button>
            </div>
        );
    }

    if (!isLoggedIn || !validRole) {
        return <Forbidden />;
    }

    return (
        <div className="PaymentMethod-container">
            {/* Payment Summary */}
            <div className="PaymentMethod-summary">
                <h1 className="PaymentMethod-title">Thanh toán</h1>
                {loading ? (
                    <Loading
                        message={t("utils.loading")}
                        height="30"
                    />
                ) : (
                    <div className="PaymentMethod-plan-details">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                            alt="Spotify Logo"
                            className="PaymentMethod-plan-logo"
                        />
                        <div className="PaymentMethod-plan-info">
                            <h2>{planDetails?.name || "Gói Premium"}</h2>
                            <p className="PaymentMethod-plan-description">
                                • Thanh toán một lần, không tự động gia hạn
                                <br />
                                • Có cập nhật Điều khoản sử dụng
                                <br />
                                • Nghe Nhạc Không Giới Hạn
                            </p>
                        </div>
                        <div className="PaymentMethod-price">
                            <p>{formatCurrencyVND(planDetails?.price)}</p>
                            <p className="PaymentMethod-duration">
                                Cho {planDetails?.duration_days || 30} ngày
                            </p>
                        </div>

                    </div>
                )
                }


            </div>

            {/* Payment Methods */}
            <div className="PaymentMethod-methods">
                <h2 className="PaymentMethod-methods-title">Phương thức thanh toán</h2>
                <label className="PaymentMethod-method-option">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="momo"
                        checked={selectedPaymentMethod === "momo"}
                        onChange={() => handlePaymentMethodChange("momo")}
                    />
                    <span>Ví MoMo</span>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                        alt="MoMo Logo"
                        className="PaymentMethod-method-logo"
                    />
                </label>

                {/* VNPay */}
                <label className="PaymentMethod-method-option">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="vnpay"
                        checked={selectedPaymentMethod === "vnpay"}
                        onChange={() => handlePaymentMethodChange("vnpay")}
                    />
                    <span>Ví VNPay</span>
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSlE3kn_naZvk8YVID5bl6ez60uBIPhDxOWg&s"
                        alt="VNPay Logo"
                        className="PaymentMethod-method-logo"
                    />
                </label>

                {/* Chuyển khoản ngân hàng */}
                <label className="PaymentMethod-method-option">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={selectedPaymentMethod === "bank_transfer"}
                        onChange={() => handlePaymentMethodChange("bank_transfer")}
                    />
                    <span>Chuyển khoản ngân hàng</span>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3094/3094700.png"
                        alt="Bank Transfer Icon"
                        className="PaymentMethod-method-logo"
                    />
                </label>

                {/* Tiền mặt */}
                <label className="PaymentMethod-method-option">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={selectedPaymentMethod === "cash"}
                        onChange={() => handlePaymentMethodChange("cash")}
                    />
                    <span>Tiền mặt (Dùng test nhanh khỏi thanh toán rờm rà)</span>
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwjZWNnoQ_c7tQVJAvnWblKXCp7D9NDS0kWw&s"
                        alt="Cash Icon"
                        className="PaymentMethod-method-logo"
                    />
                </label>

                {/* Tổng tiền và Button thanh toán */}
                <div className="PaymentMethod-total">
                    <div className="PaymentMethod-total-info">
                        <span>Tổng tiền</span>
                        <span className="PaymentMethod-total-amount">{formatCurrencyVND(planDetails?.price)}</span>
                    </div>
                    <button
                        className="PaymentMethod-pay-button"
                        onClick={handlePaymentSubmit}
                        disabled={!selectedPaymentMethod}
                    >
                        Thanh toán
                    </button>
                </div>
            </div>
        </div >
    );
};

export default PaymentMethod;