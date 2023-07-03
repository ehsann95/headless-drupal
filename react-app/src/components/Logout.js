import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

function Logout({ setUsername }) {
  useEffect(() => {
    // clear the stored keys, valued from local storage
    localStorage.clear();
    setUsername("");
  }, []);
  return <Navigate to="/" />;
}

export default Logout;
