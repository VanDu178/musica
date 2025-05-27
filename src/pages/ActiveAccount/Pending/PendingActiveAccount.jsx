import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ResendActivationModal from "../../../components/Modal/ResendActivationModal/ResendActivationModal";
import "./PendingActiveAccount.css";

const PendingActiveAccount = ({ email }) => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleResend = () => {
        setShowModal(true);
    };

    const handleBackToLogin = () => {
        navigate("/login");
    };

    return (
        <>
            <div className="pending-container">
                <h2 className="pending-title">🎉 {t("pendingActiveAccount.registerSuccess")}</h2>
                <p className="pending-text">
                    {t("pendingActiveAccount.verifyEmailSent")} <strong>{email}</strong>
                </p>
                <span className="pending-text">{t("pendingActiveAccount.checkInbox")}</span>

                <div className="pending-button-group">
                    <button
                        className="pending-button highlight"
                        onClick={handleBackToLogin}
                    >
                        {t("pendingActiveAccount.backToLogin")}
                    </button>
                </div>
                <a href="#" className="resend_link_active" onClick={handleResend}>
                    {t("pendingActiveAccount.resendActivation")}
                </a>
            </div>

            <ResendActivationModal
                open={showModal}
                onClose={() => setShowModal(false)}
                emailRegister={email}
                title={t("pendingActiveAccount.resendModalTitle")}
            />
        </>
    );
};

export default PendingActiveAccount;
