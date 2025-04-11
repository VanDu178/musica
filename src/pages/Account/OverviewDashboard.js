import React from "react";
import "./OverviewDashboard.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OverviewDashboard = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <div className="overview-container">
      <div className="overview-main">
        {/* Search Bar */}
        <div className="overview-search-bar">
          <i className="fas fa-search overview-search-icon"></i>
          <input
            type="text"
            placeholder="Tìm kiếm tài khoản hoặc bài viết trợ giúp"
            className="overview-search-input"
          />
        </div>

        {/* Subscription Section */}
        <div className="overview-row">
          <div className="overview-column">
            <div className="overview-card">
              <button
                className="overview-back-btn"
                onClick={() => navigate(-1)}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <p className="overview-text-secondary">
                {t("overview.yourPlan")}
              </p>
              <h2 className="overview-title">{t("overview.spotifyFree")}</h2>
              <button className="overview-button">
                {t("overview.learnMore")}
              </button>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="overview-account-settings">
          <h2 className="overview-title-child">{t("overview.account")}</h2>
          <ul className="overview-list">
            <li className="overview-list-item" onClick={() => navigate("#")}>
              <span>
                <i className="fab fa-spotify overview-icon"></i>{" "}
                {t("overview.manageSubscription")}
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>
            <li
              className="overview-list-item"
              onClick={() => navigate("/account/profile")}
            >
              <span>
                <i className="fas fa-user-edit overview-icon"></i>{" "}
                {t("overview.editProfile")}
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>
            <li
              className="overview-list-item"
              onClick={() => navigate("/account/change-password")}
            >
              <span>
                <i className="fas fa-lock overview-icon"></i>{" "}
                {t("overview.changePassword")}
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>

            <li className="overview-list-item" onClick={() => navigate("#")}>
              <span>
                <i className="fas fa-undo overview-icon"></i>{" "}
                {t("overview.restorePlaylist")}
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>
          </ul>
        </div>

        {/* Account Payment */}
        <div className="overview-account-settings">
          <h2 className="overview-title-child">{t("overview.payment")}</h2>
          <ul className="overview-list">
            <li className="overview-list-item" onClick={() => navigate("#")}>
              <span>
                <i className="fas fa-clipboard-list overview-icon"></i>{" "}
                {t("overview.orderHistory")}
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>
            <li className="overview-list-item" onClick={() => navigate("#")}>
              <span>
                <i className="fas fa-credit-card overview-icon"></i>{" "}
                {t("overview.savedCards")}
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>
            <li className="overview-list-item" onClick={() => navigate("#")}>
              <span>
                <i className="fas fa-exchange-alt overview-icon"></i>{" "}
                {t("overview.exchange")}
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>
          </ul>
        </div>

        {/* Account Security */}
        <div className="overview-account-settings">
          <h2 className="overview-title-child">{t("overview.security")}</h2>
          <ul className="overview-list">
            <li className="overview-list-item" onClick={() => navigate("#")}>
              <span>
                <i className="fas fa-th-large overview-icon"></i>{" "}
                {t("overview.manageApps")}
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>
            <li className="overview-list-item" onClick={() => navigate("#")}>
              <span>
                <i className="fas fa-bell overview-icon"></i>{" "}
                {t("overview.notificationSettings")}
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>
            <li className="overview-list-item" onClick={() => navigate("#")}>
              <span>
                <i className="fas fa-user-shield overview-icon"></i>{" "}
                {t("overview.privacySettings")}
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>
            <li className="overview-list-item" onClick={() => navigate("#")}>
              <span>
                <i className="fas fa-key overview-icon"></i>{" "}
                {t("overview.editLoginMethods")}
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>
            <li className="overview-list-item" onClick={() => navigate("#")}>
              <span>
                <i className="fas fa-lock overview-icon"></i>{" "}
                {t("overview.resetPassword")}
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>
            <li className="overview-list-item" onClick={() => navigate("#")}>
              <span>
                <i className="fas fa-sign-out-alt overview-icon"></i>{" "}
                {t("overview.logoutEverywhere")}
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>
          </ul>
        </div>

        {/* Account Helps */}
        <div className="overview-account-settings">
          <h2 className="overview-title-child">{t("overview.help")}</h2>
          <ul className="overview-list">
            <li className="overview-list-item" onClick={() => navigate("#")}>
              <span>
                <i className="fas fa-question-circle overview-icon"></i>{" "}
                {t("overview.supportGroup")}
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
