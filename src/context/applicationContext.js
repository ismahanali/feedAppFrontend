import React, { useState } from "react";
import { useCookies } from "react-cookie";

const AppContext = React.createContext();

const AppContextProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["appToken"]);
  const [userSessionData, setUserSessionData] = useState(undefined);
  const setUserData = (userData) => setUserSessionData(userData);
  //getting token from header and savigng it
  const setSession = (token) => {
    setCookie("appToken", token, {
      path: "/",
      maxAge: 900, // 15 minutes
    });
  };
  // gets the token to access it from the cookie.
  const getSession = () => {
    const token = cookies.appToken || null;
    return token;
  };
  const getUserData = () => userSessionData;

  const logout = () => {
    removeCookie("appToken", { path: "/" });
    setUserData(undefined);
  };

  return (
    <AppContext.Provider
      value={{
        setSession,
        getSession,
        setUserData,
        getUserData,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext };
export default AppContextProvider;
