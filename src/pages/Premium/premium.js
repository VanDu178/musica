import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCcMastercard, FaCcPaypal, FaCcVisa, FaCheck, FaCheckCircle, FaMinus, FaSpotify } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import "./Components.css";

const Premium = () => {
    const planCardsRef = React.useRef(null);
    const scrollToPlans = () => {
        planCardsRef.current.scrollIntoView({behavior: "smooth"});
    }

    const { t, i18n } = useTranslation();
    const [activeLang, setActiveLang] = useState(i18n.language);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setActiveLang(lng);
    };


    return(
        <div className="p-premium-container com-horizontal-align">
            <div className="p-view-plan com-horizontal-align">
                <h1 style={{width: "50%"}}>{t("premium.viewPlanTitle")}</h1>
                <span>{t("premium.viewPlanSubtitle")}</span>
                <nav className="com-vertical-align">
                    <button className="com-glow-zoom p-premium" style={{backgroundColor:"white", color:"black"}}>
                        <span>{t("premium.viewPlan_start")}</span>
                    </button>
                    <button className="com-glow-zoom" onClick={scrollToPlans}>
                        <span>{t("premium.viewPlan_view")}</span>
                    </button>
                </nav>
                <span className="com-vertical-align">
                    <p>{t("premium.viewPlanNote")}</p><a href="google.com">{t("premium.termsApply")}</a>
                </span>
            </div>

            <div className="p-purchase com-horizontal-align">
                <h1>{t("premium.purchaseTitle")}</h1>
                <span style={{width: "60%", marginBlock:"24px"}}>{t("premium.purchaseSubtitle")}</span>
                <div className="com-horizontal-align">
                    <div className="com-vertical-align" style={{gap:"16px"}}>
                        <FaCcVisa size={24}/>
                        <FaCcMastercard size={24}/>
                    </div>
                    <span className="p-view-hidden-cards">{t("premium.purchaseMethod")}</span>
                    <div className="com-vertical-align p-hidden-cards">
                        <FaCcVisa size={24}/>
                        <FaCcMastercard size={24}/>
                        <FaCcPaypal size={24}/>
                    </div>
                </div>
            </div>

            <div className="com-vertical-align" style={{gap:"12px", marginBlock:"32px"}}>
                <h1>{t("purchase.pros")}</h1>
                <div className="p-rights com-horizontal-align">
                    <span><FaCheck/> {t("premium.pros_1")}</span>
                    <span><FaCheck/> {t("premium.pros_2")}</span>
                    <span><FaCheck/> {t("premium.pros_3")}</span>
                    <span><FaCheck/> {t("premium.pros_4")}</span>
                    <span><FaCheck/> {t("premium.pros_5")}</span>
                    <span><FaCheck/> {t("premium.pros_6")}</span>
                </div>
                
            </div>
            {/* //#ffd2d7   -   #c4b1d4 */}

            <div className="com-vertical-align p-plan-cards" ref={planCardsRef}>
                {/* Mini plan */}
                <div className="p-plan-card">
                    <span className="p-price-tag" style={{display: "none"}}>{t("premium.mini_price")}</span>
                    <div className="p-content">
                        <div className="p-title com-hr-left-align">
                            <span className="com-vertical-align"><FaSpotify size={24}/>Premium</span>
                            <h1 style={{color:"#cff56a"}}>Mini</h1>
                            <h3>{t("premium.mini_price")}</h3>
                        </div>

                        <div className="p-separator"></div>

                        <div className="com-hr-left-align p-details">
                            <span><GoDotFill /> <p>{t("premium.mini_pros1")}</p></span>
                            <span><GoDotFill /> <p>{t("premium.mini_pros2")}</p></span>
                            <span><GoDotFill /> <p>{t("premium.mini_pros3")}</p></span>
                            <span><GoDotFill /> <p>{t("premium.mini_pros4")}</p></span>
                        </div>
                    </div>
                    <button className="com-glow-only" style={{backgroundColor:"#cff56a", color:"black", width: "100%"}}>
                        <span>{t("premium.miniBtn")}</span>
                    </button>
                    <span className="p-note"><a href="google.com">{t("premium.termsApply")}</a></span>
                </div>

                {/* Individual plan */}
                <div className="p-plan-card">
                    <span className="p-price-tag" style={{background: "#ffd2d7"}}>{t("premium.indiv_price1")}</span>
                    <div className="p-content">
                        <div className="p-title com-hr-left-align">
                            <span className="com-vertical-align"><FaSpotify size={24}/>Premium</span>
                            <h1 style={{color:"#ffd2d7"}}>Individual</h1>
                            <h3>{t("premium.indiv_price1")}</h3>
                            <h4>{t("premium.indiv_price2")}</h4>
                        </div>

                        <div className="p-separator"></div>

                        <div className="com-hr-left-align details">
                            <span><GoDotFill /> <p>{t("premium.indiv_pros1")}</p></span>
                            <span><GoDotFill /> <p>{t("premium.indiv_pros2")}</p></span>
                            <span><GoDotFill /> <p>{t("premium.indiv_pros3")}</p></span>
                            <span style={{width:0, overflow:"hidden"}}><GoDotFill/><p>placeholder</p></span>
                        </div>
                    </div>
                    <button className="com-glow-only" style={{backgroundColor:"#ffd2d7", color:"black", width: "100%"}}>
                        <span>{t("premium.indivBtn")}</span>
                    </button>
                    <span className="p-note"> {t("premium.indiv_note")}
                        <a href="google.com">{t("termsApply")}</a>
                    </span>
                </div>


                <div className="p-plan-card">
                    <span className="p-price-tag" style={{background: "#c4b1d4"}}>{t("premium.student_price1")}</span>
                    <div className="p-content">
                        <div className="p-title com-hr-left-align">
                            <span className="com-vertical-align"><FaSpotify size={24}/>Premium</span>
                            <h1 style={{color:"#c4b1d4"}}>Student</h1>
                            <h3>{t("premium.student_price1")}</h3>
                            <h4>{t("premium.student_price2")}</h4>
                        </div>

                        <div className="p-separator"></div>

                        <div className="com-hr-left-align p-details">
                            <span><GoDotFill /> <p>{t("premium.student_pros1")}</p></span>
                            <span><GoDotFill /> <p>{t("premium.student_pros2")}</p></span>
                            <span><GoDotFill /> <p>{t("premium.student_pros3")}</p></span>
                            <span><GoDotFill /> <p>{t("premium.student_pros4")}</p></span>
                        </div>
                    </div>
                    <button className="com-glow-only" style={{background: "#c4b1d4"}}>
                        <span>{t("premium.studentBtn")}</span>
                    </button>
                    <span className="p-note">{t("premium.student_note")}
                        <a href="google.com">{t("premium.termsApply")}</a>
                    </span>
                </div>
            </div>

            <div style={{margin: "32px"}}>
                <h1>{t("premium.tableTitle")}</h1>
                <h3>{t("premium.tableDesc")}</h3>
            </div>

            <div className="com-horizontal-align p-feature-table">
                <span className="p-title">
                    <p>{t("premium.tableColumn1")}</p>
                    <p>{t("premium.tableColumn2")}</p>
                    <p><FaSpotify /> Premium</p>
                </span>
                <span>
                    <p>{t("premium.tableRow_1")}</p>
                    <FaMinus /><FaCheckCircle size={16}/>
                </span>
                <span>
                    <p>{t("premium.tableRow_2")}</p>
                    <FaMinus /><FaCheckCircle size={16}/>
                </span>
                <span>
                    <p>{t("premium.tableRow_3")}</p>
                    <FaMinus /><FaCheckCircle />
                </span>
                <span>
                    <p>{t("premium.tableRow_4")}</p>
                    <FaMinus /><FaCheckCircle />
                </span>
                <span>
                    <p>{t("premium.tableRow_5")}</p>
                    <FaMinus /><FaCheckCircle />
                </span>
                <span>
                    <p>{t("premium.tableRow_6")}</p>
                    <FaMinus /><FaCheckCircle />
                </span>
            </div>
        </div>
    );
};

export default Premium;