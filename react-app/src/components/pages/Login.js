import React, { useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import axios from "axios";
import Input from "../atoms/Input";
import Button from "react-bootstrap/esm/Button";

function Login({ setUsername }) {
  const defaultFormState = { name: "", password: "" };
  const [form, setForm] = useState(defaultFormState);
  const [success, setSuccess] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BASE_URL}user/login?_format=json`,
        {
          name: form.name,
          pass: form.password,
        }
      );
      const data = await result.data;
      localStorage.setItem("username", data.current_user.name);
      localStorage.setItem("uid", data.current_user.uid);
      localStorage.setItem("csrf_token", data.csrf_token);
      localStorage.setItem("logout_token", data.logout_token);
      localStorage.setItem(
        "auth",
        window.btoa(form.name + ":" + form.password)
      );
      setSuccess(true);
      setUsername(data.current_user.name);
      await getOauthToken();
    } catch (error) {
      setErrorStatus(error.response?.data?.message);
      console.log("Error", error);
    }
  };

  const getOauthToken = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("grant_type", "password");
      formData.append("client_id", "simple_secret");
      formData.append("client_secret", "simple_secret");
      formData.append("username", form.name);
      formData.append("password", form.password);

      const result = await axios.post(
        `${process.env.REACT_APP_BASE_URL}oauth/token`,
        formData.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const data = await result.data;

      localStorage.setItem("access_token", data.access_token);
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <>
      {success && <Navigate to="/" replace={true} />}
      <div className="row top-buffer">
        <div className="col">
          <form
            className="col-md-6 offset-md-3 text-center"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <Input
                name="name"
                type="text"
                value={form.name}
                placeholder="Enter username"
                handleChange={handleChange}
              />
            </div>
            <div className="form-group top-buffer mb-2">
              <Input
                name="password"
                type="password"
                value={form.password}
                placeholder="Enter password"
                handleChange={handleChange}
              />
            </div>
            <Button type="submit">LOGIN</Button>

            <div className="form-group messages">
              <p className="success">{success && "Login success"}</p>
              <p className="error">{errorStatus}</p>
            </div>
            <NavLink to="/user/register">Don't have an account?</NavLink>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
