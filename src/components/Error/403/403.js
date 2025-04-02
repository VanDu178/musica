import React from "react";
import "./403.css";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="forbidden-container">
      <div className="forbidden-content">
        <AlertTriangle size={64} className="icon" />
        <h1>403 - Forbidden</h1>
        <p>Bạn không có quyền truy cập trang này.</p>
        {/* <button
          className="home-button"
          onClick={() => navigate("/", { replace: true })}
        >
          Quay lại trang chủ
        </button> */}
      </div>
    </div>
  );
};

export default Forbidden;
