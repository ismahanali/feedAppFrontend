import Login from "../pages/User/Login";
import Register from "../pages/User/Register";
import VerifyEmail from "../pages/User/VerifyEmail";
import ForgotPassword from "../pages/User/ForgotPassword";
import ResetPassword from "../pages/User/ResetPassword";
import React, { useState, useEffect, useContext } from "react";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Wrapper from "../components/Wrapper";
import NavBar from "../components/NavBar";

import { AppContext } from "../context/applicationContext";
import LoadingIndicator from "../components/LoadingIndicator";

import { sessionApi } from "../util/ApiUtil";

import Dashboard from "../pages/App/Dashboard";
import Profile from "../pages/App/Profile";
import CompleteProfile from "../pages/App/CompleteProfile";
import MyFeeds from "../pages/App/MyFeeds";

const AppRoutes = () => {
  // Declare variables using hooks
  const navigate = useNavigate(); // Namespace to utilize the hook
  const location = useLocation();

  const appContext = useContext(AppContext);
  const token = appContext.getSession();
  const userData = appContext.getUserData();

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  // The isAuthenticated state controls

  const pageTitles = {
    "/app/dashboard": "Dashboard",
    "/app/profile": "Profile",
    "/app/myFeeds": "My Feeds",
  };

  const getSession = async () => {
    const apiResponse = await sessionApi(token);
    if (apiResponse.status === 1) {
      appContext.setUserData(apiResponse.payLoad);
    }
  };

  useEffect(() => {
    if (token && !userData) {
      getSession();
    }
  }, []);

  useEffect(() => {
    if (!userData && !token) {
      setIsAuthenticated(false);
    }

    if (userData) {
      setIsAuthenticated(true);
      if (!userData.profile) {
        navigate("/app/completeProfile");
      }
    }
  }, [userData]);

  if (isAuthenticated === null) return <LoadingIndicator />;

  // If the user is not logged in and doesn't have a proper token, do the following.
  if (isAuthenticated === false) {
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/user/login" replace />} />
        <Route exact path="/user/login" element={<Login />} />
        <Route exact path="/user/register" element={<Register />} />
        <Route exact path="/user/verifyEmail" element={<VerifyEmail />} />
        <Route exact path="/user/forgotPassword" element={<ForgotPassword />} />
        <Route exact path="/user/resetPassword" element={<ResetPassword />} />
      </Routes>
    );
  }

  if (isAuthenticated === true) {
    return (
      <Wrapper>
        {userData && userData.profile && (
          <NavBar pageTitle={pageTitles[location.pathname]} />
        )}
        <Routes>
          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          <Route exact path="/app/dashboard" element={<Dashboard />} />
          <Route exact path="/app/myFeeds" element={<MyFeeds />} />
          <Route exact path="/app/profile" element={<Profile />} />
          <Route
            exact
            path="/app/completeProfile"
            element={<CompleteProfile />}
          />
        </Routes>
      </Wrapper>
    );
  }
};

export default AppRoutes;
