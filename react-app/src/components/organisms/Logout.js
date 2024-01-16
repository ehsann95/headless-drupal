import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { userLogin } from "../../utils/auth";

const auth = userLogin();

function Logout({ setUsername }) {
  useEffect(() => {
    auth.logout();
    setUsername("");
  }, []);
  return <Navigate to="/user/login" />;
}

export default Logout;
