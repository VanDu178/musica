import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import { AuthProvider, AuthContext } from "./context/AuthContext";
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
import PaymentMethod from "./pages/PaymentMethod/PaymentMethod";
import VNPayPayment from "./pages/VNPayPayment/VNPayPayment";

/*Artist*/
import ArtistLayout from "./Layout/ArtistLayout/ArtistLayout";
import ArtistSongList from "./pages/Artist/ArtistSongList/ArtistSongList";
import ArtistAlbumList from "./pages/Artist/ArtistAlbumList/ArtistAlbumList";
import CreateAlbum from "./pages/Artist/CreateAlbum/CreateAlbum";

import "react-toastify/dist/ReactToastify.css"; // Đừng quên import CSS của toastify

const App = () => {
  const { logout } = useContext(AuthContext);
  setLogoutFn(logout);
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <IsPlayingProvider>
          <SongProvider>
            <PlaylistProvider>
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
                    {/* <Route path="/upload" element={<Upload />} /> */}
                    <Route path="/payment-method" element={<PaymentMethod />} />
                    <Route path="/payment/vnpay" element={<VNPayPayment />} />
                  </Routes>
                  {/* Artist */}


                  <Routes>
                    {/* Các route cần sidebar được bao trong ArtistLayout */}
                    <Route
                      path="/artist/*"
                      element={
                        <ArtistLayout>
                          <Routes>
                            <Route path="/upload" element={<Upload />} />
                            <Route path="/songs" element={<ArtistSongList />} />
                            <Route path="/albums" element={<ArtistAlbumList />} />
                            <Route path="/albums/new" element={<CreateAlbum />} />
                          </Routes>
                        </ArtistLayout>
                      }
                    />
                  </Routes>

                  {/* 🔥 ToastContainer chỉ nằm trong phần ứng dụng */}
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
            </PlaylistProvider>
          </SongProvider>
        </IsPlayingProvider>
      </GoogleOAuthProvider>
    </AuthProvider >
  );
};

export default App;
