import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Đúng cách
import Home from "./pages/Home";
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ResetPassword from './pages/ForgotPassword/ForgotPassword';
import Overview from './pages/Account/OverviewDashboard';
import Profile from './pages/Account/Profile/Profile';
import Chat from './pages/Chat/DeepSeekChat';

function App() {
  return (
    <Router>
      <div className="App" style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
        {/* Điều hướng trang */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Trang mặc định là Home */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password-reset" element={<ResetPassword />} />
          <Route path="/account/overview/" element={<Overview />} />
          <Route path="/account/profile/" element={<Profile />} />
          <Route path="/chat/" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
