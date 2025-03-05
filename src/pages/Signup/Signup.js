import { useState } from "react";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import SignupStep3 from "./SignupStep3";
import "bootstrap/dist/css/bootstrap.min.css";


const Signup = () => {
    const [step, setStep] = useState(1);
    // State lưu thông tin người dùng
    const [userData, setUserData] = useState({
        email: "",
        password: "",
        day: "",
        month: "",
        year: "",
        gender: ""
    });

    return (
        <div className="signup-container " style={{ height: "105vh" }}>
            {step === 1 && <SignupStep1 onNext={() => setStep(2)} userData={userData} setUserData={setUserData} />}
            {step === 2 && <SignupStep2 onNext={() => setStep(3)} onBack={() => setStep(1)} userData={userData} setUserData={setUserData} />}
            {step === 3 && <SignupStep3 onBack={() => setStep(2)} userData={userData} setUserData={setUserData} />}
        </div>
    );
};

export default Signup;
