import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const userId = localStorage.getItem("uid");
    const token = localStorage.getItem("access_token");

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}jsonapi/user/user?filter[uid]=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
