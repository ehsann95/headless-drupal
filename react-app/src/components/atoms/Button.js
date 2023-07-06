import React from "react";

function Button({ title, classes, type = null }) {
  return (
    <button type={type} className={`btn ${classes}`}>
      {title}
    </button>
  );
}

export default Button;
