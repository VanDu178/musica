import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaCheck,
  FaCheckCircle,
  FaMinus,
  FaSpotify,
} from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../../context/UserDataProvider";
import axiosInstance from "../../config/axiosConfig"; // Import axios
import { formatCurrencyVND } from "../../helpers/formatCurrency";
import "./Premium.css";

const Premium = () => {
  const planCardsRef = React.useRef(null);
  const { isLoggedIn } = useUserData();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]); // Lưu danh sách gói Premium

  // Fetch danh sách gói Premium từ backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get("/plans/");
        setPlans(response.data); // Lưu danh sách gói
      } catch (error) {
        console.error("Lỗi khi lấy danh sách gói:", error);
      }
    };
    fetchPlans();
  }, []);

  const scrollToPlans = () => {
    planCardsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const loginCheck = (planId) => {
    if (!isLoggedIn) {
      alert("Please log in to proceed.");
      navigate("/login");
    } else {
      navigate("/payment-method", { state: { planId } });
    }
  };

  const { t } = useTranslation();

  return (
    <div className="p-premium-container com-horizontal-align">
      <div className="p-view-plan com-horizontal-align">
        <h1 style={{ width: "50%" }}>{t("premium.viewPlanTitle")}</h1>
        <span>{t("premium.viewPlanSubtitle")}</span>
        <nav className="com-vertical-align">
          <button
            className="com-glow-zoom p-premium"
            style={{ backgroundColor: "white", color: "black" }}
            onClick={loginCheck}
          >
            <span>{t("premium.viewPlan_start")}</span>
          </button>
          <button className="com-glow-zoom" onClick={scrollToPlans}>
            <span>{t("premium.viewPlan_view")}</span>
          </button>
        </nav>
        <span className="com-vertical-align">
          <p>{t("premium.viewPlanNote")}</p>
          <a href="google.com">{t("premium.termsApply")}</a>
        </span>
      </div>

      <div className="p-purchase com-horizontal-align">
        <h1>{t("premium.purchaseTitle")}</h1>
        <span style={{ width: "60%", marginBlock: "24px" }}>
          {t("premium.purchaseSubtitle")}
        </span>
        <div className="com-horizontal-align">
          <div className="com-vertical-align" style={{ gap: "16px" }}>
            <FaCcVisa size={24} />
            <FaCcMastercard size={24} />
          </div>
          <span className="p-view-hidden-cards">
            {t("premium.purchaseMethod")}
          </span>
          <div className="com-vertical-align p-hidden-cards">
            <FaCcVisa size={24} />
            <FaCcMastercard size={24} />
            <FaCcPaypal size={24} />
          </div>
        </div>
      </div>

      <div
        className="com-vertical-align"
        style={{ gap: "12px", marginBlock: "32px" }}
      >
        <h1>{t("premium.pros")}</h1>
        <div className="p-rights com-horizontal-align">
          <span>
            <FaCheck /> {t("premium.pros_1")}
          </span>
          <span>
            <FaCheck /> {t("premium.pros_2")}
          </span>
          <span>
            <FaCheck /> {t("premium.pros_3")}
          </span>
          <span>
            <FaCheck /> {t("premium.pros_4")}
          </span>
          <span>
            <FaCheck /> {t("premium.pros_5")}
          </span>
          <span>
            <FaCheck /> {t("premium.pros_6")}
          </span>
        </div>
      </div>
      <div className="com-vertical-align p-plan-cards" ref={planCardsRef}>
        {Array.isArray(plans) && plans.length > 0 ? (
          plans.map((plan) => {
            let planColor = "#cff56a"; // Mặc định màu Mini
            if (plan.name === "Individual") planColor = "#ffd2d7";
            if (plan.name === "Student") planColor = "#c4b1d4";

            return (
              <div className="p-plan-card" key={plan.id}>
                <span className="p-price-tag" style={{ background: planColor }}>
                  {formatCurrencyVND(plan.price)} VND
                </span>
                <div className="p-content">
                  <div className="p-title com-hr-left-align">
                    <span className="com-vertical-align">
                      <FaSpotify size={24} />
                      Premium
                    </span>
                    <h1 style={{ color: planColor }}>{plan.name}</h1>
                    <h3>{plan.price} VND</h3>
                    <h4>
                      {plan.duration_days} {t("premium.days")}
                    </h4>
                  </div>

                  <div className="p-separator"></div>

                  <div className="com-hr-left-align p-details">
                    {plan.benefits?.map((benefit, index) => (
                      <span key={index}>
                        <GoDotFill /> <p>{benefit}</p>
                      </span>
                    ))}
                  </div>
                  <div className="com-hr-left-align p-details">
                    <span>
                      <GoDotFill /> <p>{t("premium.indiv_pros1")}</p>
                    </span>
                    <span>
                      <GoDotFill /> <p>{t("premium.indiv_pros2")}</p>
                    </span>
                    <span>
                      <GoDotFill /> <p>{t("premium.indiv_pros3")}</p>
                    </span>
                    <span style={{ width: 0, overflow: "hidden" }}>
                      <GoDotFill />
                      <p>placeholder</p>
                    </span>
                  </div>
                </div>
                <button
                  className="com-glow-only"
                  style={{
                    backgroundColor: planColor,
                    color: "black",
                    width: "100%",
                  }}
                  onClick={() => loginCheck(plan.id)}
                >
                  <span>{t("premium.subscribe")}</span>
                </button>
                <span className="p-note">
                  <a href="google.com">{t("premium.termsApply")}</a>
                </span>
              </div>
            );
          })
        ) : (
          <p>Loading plans...</p> // Hiển thị khi chưa có data
        )}
      </div>

      <div style={{ margin: "32px" }}>
        <h1>{t("premium.tableTitle")}</h1>
        <h3>{t("premium.tableDesc")}</h3>
      </div>

      <div className="com-horizontal-align p-feature-table">
        <span className="p-title">
          <p>{t("premium.tableColumn1")}</p>
          <p>{t("premium.tableColumn2")}</p>
          <p>
            <FaSpotify /> Premium
          </p>
        </span>
        <span>
          <p>{t("premium.tableRow_1")}</p>
          <FaMinus />
          <FaCheckCircle size={16} />
        </span>
        <span>
          <p>{t("premium.tableRow_2")}</p>
          <FaMinus />
          <FaCheckCircle size={16} />
        </span>
        <span>
          <p>{t("premium.tableRow_3")}</p>
          <FaMinus />
          <FaCheckCircle />
        </span>
        <span>
          <p>{t("premium.tableRow_4")}</p>
          <FaMinus />
          <FaCheckCircle />
        </span>
        <span>
          <p>{t("premium.tableRow_5")}</p>
          <FaMinus />
          <FaCheckCircle />
        </span>
        <span>
          <p>{t("premium.tableRow_6")}</p>
          <FaMinus />
          <FaCheckCircle />
        </span>
      </div>
    </div>
  );
};

export default Premium;
