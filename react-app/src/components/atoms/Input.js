import React from "react";

function Input({ name, type, value, placeholder, classes, handleChange }) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      required
      className={`form-control ${classes ? classes : ""}`}
    />
  );
}

export default Input;
