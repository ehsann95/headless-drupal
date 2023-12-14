import React, { useEffect, useState } from "react";
import axios from "axios";
import { userLogin } from "../../utils/auth";

function Profile() {
  const [user, setUser] = useState({ name: "", email: "" });
  let refToken = "";
  const token = JSON.parse(localStorage.getItem("drupal-oauth-token"));
  if (token) {
    refToken = token.refresh_token;
  }

  // auth.isLoggedIn();
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        // Call the refreshToken function from the userLogin module
        const auth = userLogin();
        await auth.refreshToken(refToken); // Pass the actual refresh token
        // If the refresh token is successful, you can perform additional actions here
        getCurrentUser();
      } catch (error) {
        // Handle refresh token errors
        console.error("Refresh token failed:", error.message);
      }
    };

    // Call the refreshAccessToken function when the component mounts
    // refreshAccessToken();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const username = localStorage.getItem("username");
    const token = JSON.parse(localStorage.getItem("drupal-oauth-token"));
    const access_token = token?.access_token;

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}jsonapi/user/user?filter[name]=${username}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const data = res.data.data[0];
      setUser({
        username: data.attributes.name,
        email: data.attributes.mail,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="row top-buffer">
      <div className="col-md-4 offset-md-4">
        <ul className="list-group">
          <li
            href="#"
            className="list-group-item list-group-item-action list-group-item-success"
          >
            User Profile
          </li>
          <li href="#" className="list-group-item list-group-item-action">
            <strong>Username: </strong>
            {user.username}
          </li>
          <li href="#" className="list-group-item list-group-item-action">
            <strong>Email: </strong>
            {user.email}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;
