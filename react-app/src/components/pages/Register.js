import React, { useState } from "react";
import axios from "axios";
import { NavLink, Navigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { useForm } from "react-hook-form";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const onSubmit = async (form) => {
    if (form.password !== form.confirmPassword) {
      setApiError("Password did not match");
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
      if (result.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      setApiError(err.response?.data?.message);
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
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="form-group mb-2">
              <input
                className="form-control"
                name="name"
                type="text"
                placeholder="Enter username"
                {...register("name", {
                  required: "Username is required",
                  maxLength: {
                    value: 6,
                    message: "Username cannot be more than 6 char long",
                  },
                })}
              />
              <p className="text-danger">{errors.name?.message}</p>
            </div>
            <div className="form-group mb-2">
              <input
                className="form-control"
                name="email"
                type="email"
                placeholder="Enter email"
                {...register("email", { required: "This Email is required." })}
              />
              <p className="text-danger">{errors.email?.message}</p>
            </div>
            <div className="form-group mb-2">
              <input
                className="form-control"
                name="password"
                type="password"
                placeholder="Enter password"
                {...register("password", { required: "Password is required" })}
              />
              <p className="text-danger">{errors.password?.message}</p>
            </div>
            <div className="form-group mb-2">
              <input
                className="form-control"
                name="confirmPassword"
                type="password"
                placeholder="Enter password again"
                {...register("confirmPassword", {
                  required: "Password is required",
                })}
              />
              <p className="text-danger">{errors.confirmPassword?.message}</p>
            </div>
            <Button variant="success" type="submit">
              REGISTER
            </Button>

            <div className="form-group messages">
              <p className="success">{success}</p>
              <p className="error">{apiError}</p>
            </div>
            <NavLink to="/user/login">Already have an account?</NavLink>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
