import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import { SongProvider } from "./context/SongProvider";
import { PlaylistProvider } from "./context/PlaylistProvider";
import { IsPlayingProvider } from "./context/IsPlayingProvider";
import { setLogoutFn } from "./helpers/auth";
import Main from "./Layout/Main/Main";
import SpotifyLogin from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ResetPassword from "./pages/ForgotPassword/ForgotPassword";
import Overview from "./pages/Account/OverviewDashboard";
import Profile from "./pages/Account/Profile/Profile";
import Chat from "./pages/Chat/DeepSeekChat";
import Premium from "./pages/Premium/premium";
import Home from "./pages/Home/Home";
import Upload from "./pages/UploadPage/UploadPage";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./routes/PrivateRoute";
import { AuthContext } from "./context/AuthContext";
import { UserProvider } from "./context/UserProvider";

const App = () => {
  const { logout, isLoggedIn } = useContext(AuthContext);
  setLogoutFn(logout);

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <IsPlayingProvider>
        <SongProvider>
          <PlaylistProvider>
            <UserProvider>
              <Router>
                <div
                  className="App"
                  style={{ backgroundColor: "#000000", minHeight: "100vh" }}
                >
                  <Routes>
                    <Route path="/" element={<Main />} />
                    <Route
                      path="/playlist/:idPlaylist"
                      element={<Main />}
                    />{" "}
                    {/* Route cho playlist */}
                    <Route path="/login" element={<SpotifyLogin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/password-reset" element={<ResetPassword />} />
                    <Route path="/chat/" element={<Chat />} />
                    <Route path="/premium/" element={<Premium />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/account/profile/" element={<Profile />} />
                    <Route element={<PrivateRoute isLoggedIn={isLoggedIn} />}>
                      <Route path="/account/overview/" element={<Overview />} />
                    </Route>
                  </Routes>

                  {/* ToastContainer chỉ nằm trong phần ứng dụng */}
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                  />
                </div>
              </Router>
            </UserProvider>
          </PlaylistProvider>
        </SongProvider>
      </IsPlayingProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
