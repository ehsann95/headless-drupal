import React, { useState } from "react";
import axios from "axios";
import { NavLink, Navigate } from "react-router-dom";
import Input from "../atoms/Input";
import Button from "react-bootstrap/esm/Button";

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
      const result = await axios.post(
        `${process.env.REACT_APP_BASE_URL}user/register?_format=json`,
        {
          name: [{ value: form.name }],
          mail: [{ value: form.email }],
          pass: [{ value: form.password }],
        }
      );
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
              <Input
                name="name"
                type="text"
                value={form.name}
                placeholder="Enter username"
                handleChange={handleChange}
              />
            </div>
            <div className="form-group mb-2">
              <Input
                name="email"
                type="email"
                value={form.email}
                placeholder="Enter email"
                handleChange={handleChange}
              />
            </div>
            <div className="form-group mb-2">
              <Input
                name="password"
                type="password"
                value={form.password}
                placeholder="Enter password"
                handleChange={handleChange}
              />
            </div>
            <div className="form-group mb-2">
              <Input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                placeholder="Enter password again"
                handleChange={handleChange}
              />
            </div>
            <Button variant="success" type="submit">
              REGISTER
            </Button>

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
