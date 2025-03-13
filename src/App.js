import { Route, BrowserRouter as Router, Routes } from "react-router-dom"; // Đúng cách
import "./App.css";

import Main from "./Layout/Main/Main";
import Overview from "./pages/Account/OverviewDashboard";
import Profile from "./pages/Account/Profile/Profile";
import Chat from "./pages/Chat/DeepSeekChat";
import ResetPassword from "./pages/ForgotPassword/ForgotPassword";
import Login from "./pages/Login/Login";
import Premium from "./pages/Premium/Premium";
import Signup from "./pages/Signup/Signup";

function App() {
  return (
    <Router>
      <div className="App" style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
        {/* Điều hướng trang */}
        <Routes>
          <Route path="/" element={<Main />} /> {/* Trang mặc định là Main */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password-reset" element={<ResetPassword />} />
          <Route path="/account/overview/" element={<Overview />} />
          <Route path="/account/profile/" element={<Profile />} />
          <Route path="/chat/" element={<Chat />} />
          <Route path="/premium/" element={<Premium />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
