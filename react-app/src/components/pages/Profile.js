import React, { useEffect, useState } from "react";
import axios from "axios";
import { userLogin } from "../../utils/auth";

const auth = userLogin();

function Profile() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    auth
      .isLoggedIn()
      .then((res) => {
        console.log();
        getCurrentUser();
        setLoggedIn(true);
      })
      .catch((error) => {
        console.log(error);
        setLoggedIn(false);
      });
  }, []);

  const getCurrentUser = () => {
    const username = localStorage.getItem("username");
    const fetchUrl = `jsonapi/user/user?filter[name]=${username}`;
    const fetchOptions = {
      method: "GET",
      headers: new Headers({}),
    };

    try {
      auth
        .fetchWithAuthentication(fetchUrl, fetchOptions)
        .then((response) => response.json())
        .then((data) => {
          setUser({
            username: data.data[0].attributes.name,
            email: data.data[0].attributes.mail,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="row top-buffer">
      {isLoggedIn && <h2>Welcome User</h2>}

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
