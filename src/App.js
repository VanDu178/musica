import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import { SongProvider } from "./context/SongProvider";
import { PlaylistProvider } from "./context/PlaylistProvider";
import { IsPlayingProvider } from "./context/IsPlayingProvider";
import Main from "./Layout/Main/Main";
import SpotifyLogin from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ResetPassword from "./pages/ForgotPassword/ForgotPassword";
import Overview from "./pages/Account/OverviewDashboard";
import Profile from "./pages/Account/Profile/Profile";
import ChangePassword from "./pages/Account/ChangePassword/ChangePassword";
import Chat from "./pages/Chat/Chat";
import Premium from "./pages/Premium/premium";
import Home from "./pages/Home/Home";
import Upload from "./pages/UploadPage/UploadPage";
import { UserProvider } from "./context/UserProvider";
import { UserDataProvider } from "./context/UserDataProvider";
import { SearchProvider } from "./context/SearchContext";
import { IsVisiableRootModalProvider } from "./context/IsVisiableRootModal";
import PaymentMethod from "./pages/PaymentMethod/PaymentMethod";
import VNPayPayment from "./pages/VNPayPayment/VNPayPayment";
import ArtistRegistration from "./pages/ArtistRegistration/ArtistRegistration";
import ArtistRegistrationRequests from "./pages/Admin/ArtistRegistrationRequests/ArtistRegistrationRequests";
import AccountManagement from "./pages/Admin/AccountManagement/AccountManagement";
import PlanManagement from "./pages/Admin/PlanManagement/PlanManagement";

import PlaylistDetail from "./pages/PlaylistDetail/PlaylistDetail";
import ActivateAccount from "./pages/ActiveAccount/ActivateAccount";
import PublicProfile from "./pages/PublicProfile/PublicProfile";

import VideoPlayer from "./pages/VideoPlayer/VideoPlayer";
import VideoUploadForm from "./pages/Artist/VideoUploadForm/VideoUploadForm";
import Search from "./pages/Search/Search";
import VideoDownloadPage from "./pages/VideoDownloadPage/VideoDownloadPage";

/*Artist*/
import ArtistLayout from "./Layout/ArtistLayout/ArtistLayout";
import ArtistSongList from "./pages/Artist/ArtistSongList/ArtistSongList";
import ArtistAlbumList from "./pages/Artist/ArtistAlbumList/ArtistAlbumList";
import CreateAlbum from "./pages/Artist/CreateAlbum/CreateAlbum";

/*Admin*/
import AdminLayout from "./Layout/AdminLayout/AdminLayout";

import "react-toastify/dist/ReactToastify.css"; // Đừng quên import CSS của toastify

const App = () => {
  return (
    <UserDataProvider>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <UserProvider>
          <SearchProvider>
            <IsPlayingProvider>
              <SongProvider>
                <PlaylistProvider>
                  <UserProvider>
                    <IsVisiableRootModalProvider>
                      <Router>
                        <div
                          className="App"
                          style={{
                            backgroundColor: "#000000",
                            minHeight: "80vh",
                          }}
                        >
                          <Routes>
                            {/* Các route không cần sidebar,header,footer */}
                            <Route
                              path="/activate/:uidb64/:token"
                              element={<ActivateAccount />}
                            />
                            <Route path="/login" element={<SpotifyLogin />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route
                              path="/password-reset"
                              element={<ResetPassword />}
                            />
                            <Route
                              path="/account/overview"
                              element={<Overview />}
                            />
                            <Route
                              path="/account/profile"
                              element={<Profile />}
                            />
                            <Route
                              path="/account/change-password"
                              element={<ChangePassword />}
                            />
                            <Route
                              path="/payment-method"
                              element={<PaymentMethod />}
                            />
                            <Route
                              path="/payment/vnpay"
                              element={<VNPayPayment />}
                            />
                            <Route
                              path="/register-artist"
                              element={<ArtistRegistration />}
                            />
                            <Route
                              path="/"
                              element={<Navigate to="/user" replace />}
                            />
                            <Route
                              path="/download/video/:id"
                              element={<VideoDownloadPage />}
                            />
                          </Routes>
                          {/* ADMIN */}
                          {/* <Routes>
                            <Route
                              path="/admin/*"
                              element={
                                <AdminLayout>
                                  <Routes>
                                    <Route
                                      path="/account"
                                      element={<Upload />}
                                    />
                                    <Route
                                      path="/artist-registration-requests"
                                      element={<ArtistRegistrationRequests />}
                                    />
                                    <Route
                                      path="/account-management"
                                      element={<AccountManagement />}
                                    />
                                    <Route
                                      path="/my-profile"
                                      element={<Profile />}
                                    />
                                    <Route
                                      path="/plan-management"
                                      element={<PlanManagement />}
                                    />
                                    <Route
                                      path="/change-password"
                                      element={<ChangePassword />}
                                    />
                                  </Routes>
                                </AdminLayout>
                              }
                            />
                          </Routes> */}

                          {/* ARTIST */}
                          {/* <Routes>
                            <Route
                              path="/artist/*"
                              element={
                                <ArtistLayout>
                                  <Routes>
                                    <Route
                                      path="/my-profile"
                                      element={<Profile />}
                                    />
                                    <Route
                                      path="/upload"
                                      element={<Upload />}
                                    />
                                    <Route
                                      path="/songs"
                                      element={<ArtistSongList />}
                                    />
                                    <Route
                                      path="/albums"
                                      element={<ArtistAlbumList />}
                                    />
                                    <Route
                                      path="/albums/new"
                                      element={<CreateAlbum />}
                                    />
                                    <Route
                                      path="/change-password"
                                      element={<ChangePassword />}
                                    />
                                    <Route
                                      path="/video-upload"
                                      element={<VideoUploadForm />}
                                    />
                                  </Routes>
                                </ArtistLayout>
                              }
                            />
                          </Routes> */}

                          {/* USER */}
                          <Routes>
                            {/* Các route cần sidebar,header,footer được bao trong MainLayout */}
                            <Route
                              path="/user/*"
                              element={
                                <Main>
                                  <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route
                                      path="/playlist/:idPlaylist"
                                      element={<PlaylistDetail />}
                                    />
                                    <Route path="/chat" element={<Chat />} />
                                    <Route
                                      path="/premium"
                                      element={<Premium />}
                                    />
                                    <Route
                                      path="/public-profile/:profileId"
                                      element={<PublicProfile />}
                                    />
                                    <Route
                                      path="/search"
                                      element={<Search />}
                                    />
                                    <Route
                                      path="/play-video/:title/:video_id/:image_path"
                                      element={<VideoPlayer />}
                                    />
                                  </Routes>
                                </Main>
                              }
                            />
                          </Routes>
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
                    </IsVisiableRootModalProvider>
                  </UserProvider>
                </PlaylistProvider>
              </SongProvider>
            </IsPlayingProvider>
          </SearchProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </UserDataProvider>
  );
};

export default App;
