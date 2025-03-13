import React from "react";
import { FaCcMastercard, FaCcPaypal, FaCcVisa, FaCheck, FaCheckCircle, FaMinus, FaSpotify } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import "./components.css";

const Premium = () => {
    const planCardsRef = React.useRef(null);
    const scrollToPlans = () => {
        planCardsRef.current.scrollIntoView({behavior: "smooth"});
    }

    return(
        <div className="premium-container horizontal-align">
            <div className="view-plan horizontal-align">
                <h1 style={{width: "50%"}}>Listen without limits. Try 2 months of Premium for ₫59,000.</h1>
                <span>Only ₫59,000/month after. Cancel anytime. </span>
                <nav className="vertical-align">
                    <button className="glow-zoom premium" style={{backgroundColor:"white", color:"black"}}>
                        <span>Get Premium Individual</span>
                    </button>
                    <button className="glow-zoom" onClick={scrollToPlans}>
                        <span>View All Plan</span>
                    </button>
                </nav>
                <span className="vertical-align">
                    <p>₫59,000 for 2 months, then ₫59,000 per month after. Offer only available if you haven’t tried Premium before.</p><a href="google.com">Terms apply.</a>
                </span>
            </div>

            <div className="purchase horizontal-align">
                <h1>Affordable plans for any situations</h1>
                <span style={{width: "60%", marginBlock:"24px"}}>Choose a Premium plan and listen to ad-free music without limits on your phone,<wbr/> speaker and other devices. Pay in various ways. Cancel anytime.</span>
                <div className="horizontal-align">
                    <div className="vertical-align" style={{gap:"16px"}}>
                        <FaCcVisa size={24}/>
                        <FaCcMastercard size={24}/>
                    </div>
                    <span className="view-hidden-cards">+3 more</span>
                    <div className="vertical-align hidden-cards">
                        <FaCcVisa size={24}/>
                        <FaCcMastercard size={24}/>
                        <FaCcPaypal size={24}/>
                    </div>
                </div>
            </div>

            <div className="vertical-align" style={{gap:"12px", marginBlock:"32px"}}>
                <h1>All Premium plans include</h1>
                <div className="rights horizontal-align">
                    <span><FaCheck/> Ad-free music listening</span>
                    <span><FaCheck/> Download to listen offline</span>
                    <span><FaCheck/> Play songs in any order</span>
                    <span><FaCheck/> High audio quality</span>
                    <span><FaCheck/> Listen with friends in real time</span>
                    <span><FaCheck/> Organize listening queue</span>
                </div>
                
            </div>
            {/* //#ffd2d7   -   #c4b1d4 */}

            <div className="vertical-align plan-cards" ref={planCardsRef}>
                {/* Mini plan */}
                <div className="plan-card">
                    <span className="price-tag" style={{display: "none"}}>₫59,000 for 2 months</span>
                    <div className="content">
                        <div className="title hr-left-align">
                            <span className="vertical-align"><FaSpotify size={24}/>Premium</span>
                            <h1 style={{color:"#cff56a"}}>Mini</h1>
                            <h3>đ10,500 for one week.</h3>
                        </div>

                        <div className="separator"></div>

                        <div className="hr-left-align details">
                            <span><GoDotFill /> <p>1 mobile-only Premium account</p></span>
                            <span><GoDotFill /> <p>Offline listening of up to 30 songs on 1 device</p></span>
                            <span><GoDotFill /> <p>One-time payment</p></span>
                            <span><GoDotFill /> <p>Basic audio quality</p></span>
                        </div>
                    </div>
                    <button className="glow-only" style={{backgroundColor:"#cff56a", color:"black", width: "100%"}}>
                        <span>Get Premium Mini</span>
                    </button>
                    <span className="note"><a href="google.com">Terms apply.</a></span>
                </div>

                {/* Individual plan */}
                <div className="plan-card">
                    <span className="price-tag" style={{background: "#ffd2d7"}}>₫59,000 for 2 months</span>
                    <div className="content">
                        <div className="title hr-left-align">
                            <span className="vertical-align"><FaSpotify size={24}/>Premium</span>
                            <h1 style={{color:"#ffd2d7"}}>Individual</h1>
                            <h3>đ59,000 for 2 months.</h3>
                            <h4>đ59,000/month after.</h4>
                        </div>

                        <div className="separator"></div>

                        <div className="hr-left-align details">
                            <span><GoDotFill /> <p>1 Premium account</p></span>
                            <span><GoDotFill /> <p>Cancel anytime</p></span>
                            <span><GoDotFill /> <p>Subscribe or one-time payment</p></span>
                            <span style={{width:0, overflow:"hidden"}}><GoDotFill/><p>placeholder</p></span>
                        </div>
                    </div>
                    <button className="glow-only" style={{backgroundColor:"#ffd2d7", color:"black", width: "100%"}}>
                        <span>Get Premium Individual</span>
                    </button>
                    <span className="note">
                        đ59,000 for 2 months, then đ59,000 per month after. Option only available if you haven’t tried Premium before.<a href="google.com">Terms apply.</a>
                    </span>
                </div>


                <div className="plan-card">
                    <span className="price-tag" style={{background: "#c4b1d4"}}>₫59,000 for 2 months</span>
                    <div className="content">
                        <div className="title hr-left-align">
                            <span className="vertical-align"><FaSpotify size={24}/>Premium</span>
                            <h1 style={{color:"#c4b1d4"}}>Student</h1>
                            <h3>đ29,500 for 2 months.</h3>
                            <h4>đ29,500/month after.</h4>
                        </div>

                        <div className="separator"></div>

                        <div className="hr-left-align details">
                            <span><GoDotFill /> <p>1 verified Premium account</p></span>
                            <span><GoDotFill /> <p>Discount for eligible students</p></span>
                            <span><GoDotFill /> <p>Cancel anytime</p></span>
                            <span><GoDotFill /> <p>Subscribe or one-time payment</p></span>
                        </div>
                    </div>
                    <button className="glow-only" style={{background: "#c4b1d4"}}>
                        <span>Get Premium Student</span>
                    </button>
                    <span className="note">
                        đ29,500 for 2 months, then đ29,000 per month after. Option only available only to students at an accredited higher education institution and if you haven't tried premium before.
                        <a href="google.com">Terms apply.</a>
                    </span>
                </div>
            </div>

            <div style={{margin: "32px"}}>
                <h1>Experience the difference</h1>
                <h3>Go premium and enjoy full control of your listening. Cancel anytime.</h3>
            </div>

            <div className="horizontal-align feature-table">
                <span className="title">
                    <p>What you'll get</p>
                    <p>Spotify's free plan</p>
                    <p><FaSpotify /> Premium</p>
                </span>
                <span>
                    <p>Ads free music listening</p>
                    <FaMinus /><FaCheckCircle size={16}/>
                </span>
                <span>
                    <p>Download songs</p>
                    <FaMinus /><FaCheckCircle size={16}/>
                </span>
                <span>
                    <p>Play songs in any order</p>
                    <FaMinus /><FaCheckCircle />
                </span>
                <span>
                    <p>High quality audio</p>
                    <FaMinus /><FaCheckCircle />
                </span>
                <span>
                    <p>Listen with friends in real time</p>
                    <FaMinus /><FaCheckCircle />
                </span>
                <span>
                    <p>Organize listening queue</p>
                    <FaMinus /><FaCheckCircle />
                </span>
            </div>

            <h1>HELLOOOO</h1>
        </div>
    );
};

export default Premium;