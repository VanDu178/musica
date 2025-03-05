import { useState, useEffect } from "react";
import "./SignupStep3.css";
import logo from "../../assets/images/logo.png";
import { useTranslation } from "react-i18next";

const SignupStep3 = ({ onNext, onBack, userData, setUserData }) => {
    const [daysList, setDaysList] = useState([...Array(31)].map((_, i) => i + 1)); // Mặc định 31 ngày
    const { t, i18n } = useTranslation();

    // Khi component mount, lấy dữ liệu đã lưu vào state cục bộ
    useEffect(() => {
        if (userData.day && userData.month && userData.year) {
            const daysInMonth = new Date(userData.year, userData.month, 0).getDate();
            setDaysList([...Array(daysInMonth)].map((_, i) => i + 1));
        }
    }, [userData.month, userData.year]);

    // Cập nhật danh sách ngày khi tháng hoặc năm thay đổi
    useEffect(() => {
        if (userData.month && userData.year) {
            const daysInMonth = new Date(userData.year, userData.month, 0).getDate();
            setDaysList([...Array(daysInMonth)].map((_, i) => i + 1));

            if (userData.day > daysInMonth) {
                setUserData((prev) => ({ ...prev, day: daysInMonth }));
            }
        }
    }, [userData.month, userData.year, setUserData]);

    const isFormValid = userData.name && userData.day && userData.month && userData.year && userData.gender;

    return (
        <div className="signup-step-3">
            <img src={logo} alt="Spotify" className="logo" />
            <div className="progress-bar" style={{
                width: "100%", height: "3px", background: "linear-gradient(to right,#1DB954 100%, #333 0%)"
            }}></div>

            <button className="back-btn" onClick={onBack}>
                ← {t(`signupStep3.step`)} 2/2
            </button>

            <h2 className="title">{t(`signupStep3.title`)}</h2>

            {/* Nhập tên */}
            <label className="form-label">{t(`signupStep3.nameLabel`)}</label>
            <p className="form-p">{t(`signupStep3.nameDescription`)}</p>
            <input
                type="text"
                className="form-control"
                placeholder={t(`signupStep3.namePlaceholder`)}
                value={userData.name}
                onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
            />

            {/* Nhập ngày sinh */}
            <label className="form-label">{t(`signupStep3.dobLabel`)}</label>
            <p className="form-p">{t(`signupStep3.dobDescription`)}</p>
            <div className="birthday-inputs">
                <select className="form-control" value={userData.day} onChange={(e) => setUserData((prev) => ({ ...prev, day: e.target.value }))}>
                    <option value="">{t(`signupStep3.selectDay`)}</option>
                    {daysList.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>

                <select className="form-control" value={userData.month} onChange={(e) => setUserData((prev) => ({ ...prev, month: e.target.value }))}>
                    <option value="">{t(`signupStep3.selectMonth`)}</option>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </select>

                <select className="form-control" value={userData.year} onChange={(e) => setUserData((prev) => ({ ...prev, year: e.target.value }))}>
                    <option value="">{t(`signupStep3.selectYear`)}</option>
                    {[...Array(new Date().getFullYear() - 1900 + 1)]
                        .map((_, i) => 1900 + i)
                        .reverse()
                        .map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                </select>
            </div>

            {/* Giới tính */}
            <label className="form-label">{t(`signupStep3.genderLabel`)}</label>
            <p className="form-p">{t(`signupStep3.genderDescription`)}</p>
            <div className="gender-options">
                {["male", "female", "nonBinary", "other", "preferNotToSay"].map((key) => (
                    <label key={key}>
                        <input
                            type="radio"
                            name="gender"
                            value={t(`signupStep3.genderOptions.${key}`)}
                            checked={userData.gender === t(`signupStep3.genderOptions.${key}`)}
                            onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                        />
                        {t(`signupStep3.genderOptions.${key}`)}
                    </label>
                ))}
            </div>

            {/* Nút tiếp theo */}
            <button className="next-btn" onClick={onNext} disabled={!isFormValid}>
                {t(`signupStep3.nextButton`)}
            </button>
        </div>
    );
};

export default SignupStep3;
