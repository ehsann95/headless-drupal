import React, { useState, useEffect } from "react";
import { NavLink, Navigate } from "react-router-dom";
import Input from "../atoms/Input";
import Button from "react-bootstrap/esm/Button";
import { useForm } from "react-hook-form";
import { userLogin } from "../../utils/auth";

const auth = userLogin();

function Login({ setUsername }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [success, setSuccess] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    auth
      .isLoggedIn()
      .then((res) => {
        setLoggedIn(true);
      })
      .catch((error) => {
        setLoggedIn(false);
      });
  }, []);

  const onSubmit = async (form) => {
    auth
      .login(form.username, form.password)
      .then(() => {
        setSuccess(true);
        setUsername(localStorage.getItem("username"));
      })
      .catch((error) => {
        console.log(error);
        setErrorStatus("Error Logging In");
      });
  };
  return (
    <>
      {success && <Navigate to="/" replace={true} />}
      {isLoggedIn && <h2>You're already logged in</h2>}
      <div className="row top-buffer">
        <div className="col">
          <form
            className="col-md-6 offset-md-3 text-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="form-group">
              <input
                name="name"
                className="form-control"
                type="text"
                placeholder="Enter username"
                {...register("username", { required: "Username is required." })}
              />
              <span className="text-danger small">
                {errors.username?.message}
              </span>
            </div>
            <div className="form-group top-buffer mb-2">
              <input
                name="password"
                className="form-control"
                type="password"
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 4,
                    message: "Password must be minimun 4 char long.",
                  },
                })}
              />
              <span className="text-danger small">
                {errors.password?.message}
              </span>
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
