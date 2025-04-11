import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Cookies.get("refresh_token") ? true : false;
  });
  useEffect(() => {
    const token = Cookies.get("refresh_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, [isLoggedIn]);
  return (
    <UserDataContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, userData, setUserData }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useUserData = () => {
  return useContext(UserDataContext);
};
