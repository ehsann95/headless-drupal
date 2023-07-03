import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/config";

import { NavLink, Navigate } from "react-router-dom";

function Register() {
  const defaultValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [form, setForm] = useState(defaultValues);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Password did not match");
      return;
    }

    try {
      const result = await axios.post(`${BASE_URL}user/register?_format=json`, {
        name: [{ value: form.name }],
        mail: [{ value: form.email }],
        pass: [{ value: form.password }],
      });
      setSuccess(true);
      console.log(result);
    } catch (err) {
      setError(err.response?.data?.message);
      console.log(err);
    }
  };
  return (
    <>
      {success && <Navigate to="/user/login" replace={true} />}

      <div className="row top-buffer">
        <div className="col">
          <form
            className="col-md-6 offset-md-3 text-center"
            onSubmit={handleSubmit}
          >
            <div className="form-group mb-2">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                type="text"
                className="form-control"
                placeholder="Enter username"
              />
            </div>
            <div className="form-group mb-2">
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                type="email"
                className="form-control"
                placeholder="Enter email"
              />
            </div>
            <div className="form-group mb-2">
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                type="password"
                className="form-control"
                placeholder="Enter password"
              />
            </div>
            <div className="form-group mb-2">
              <input
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                type="password"
                className="form-control"
                placeholder="Enter password again"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Register
            </button>
            <div className="form-group messages">
              {/* <p className="success">{success}</p> */}
              <p className="error">{error}</p>
            </div>
            <NavLink to="/user/login">Already have an account?</NavLink>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
