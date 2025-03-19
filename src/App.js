import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";

import Main from "./Layout/Main/Main";
import SpotifyLogin from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ResetPassword from "./pages/ForgotPassword/ForgotPassword";
import Overview from "./pages/Account/OverviewDashboard";
import Profile from "./pages/Account/Profile/Profile";
import Chat from "./pages/Chat/DeepSeekChat";
import Premium from "./pages/Premium/premium";
import Home from "./pages/Home/Home";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <div
            className="App"
            style={{ backgroundColor: "#000000", minHeight: "100vh" }}
          >
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/login" element={<SpotifyLogin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/password-reset" element={<ResetPassword />} />
              <Route path="/account/overview/" element={<Overview />} />
              <Route path="/account/profile/" element={<Profile />} />
              <Route path="/chat/" element={<Chat />} />
              <Route path="/premium/" element={<Premium />} />
              <Route path="/home" element={<Home />} />
            </Routes>
            <ToastContainer />
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
