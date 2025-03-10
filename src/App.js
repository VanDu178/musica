import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Đúng cách
// import Home from "./pages/Home/Home";
import Main from "./Layout/Main/Main";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ResetPassword from "./pages/ForgotPassword/ForgotPassword";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Điều hướng trang */}
        <Routes>
          <Route path="/" element={<Main />} /> {/* Trang mặc định là Main */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password-reset" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
