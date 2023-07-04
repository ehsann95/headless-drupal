import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/config";

function CreateArticle() {
  const defaultValues = {
    title: "",
    body: "",
  };

  const [isSubmitting, setSubmitting] = useState(false);

  const [result, setResult] = useState({
    success: null,
    error: null,
    message: "",
  });

  const [values, setValues] = useState(defaultValues);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    const fetchUrl = `${BASE_URL}jsonapi/node/article`;

    let body = {
      data: {
        type: "node--article",
        attributes: {
          title: `${values.title}`,
          body: {
            value: `${values.body}`,
            format: "plain_text",
          },
        },
      },
    };

    let token = localStorage.getItem("access_token");

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
    };

    try {
      const res = await axios.post(fetchUrl, body, {
        headers: headers,
      });
      console.log(res);
      const data = res.data;
      setSubmitting(false);
      setValues(defaultValues);
      if (data.data.id) {
        setResult({
          success: true,
          message: (
            <div className="text-success">
              {"Added"}: <em>{data.data.attributes.title}</em>
            </div>
          ),
        });
      }
    } catch (error) {
      console.log("Error while contacting API", error);
      setResult({
        success: false,
        error: true,
        message: <p className="text-danger">{error.message}</p>,
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="row top-buffer">
      <div className="col">
        {(result.success || result.error) && (
          <div className="my-3">
            <h2>{result.success ? "Success!" : "Error"}:</h2>
            {result.message}
          </div>
        )}
        <form
          className="col-md-6 offset-md-3 text-center"
          onSubmit={handleSubmit}
        >
          <div className="form-group mb-2">
            <input
              name="title"
              type="text"
              value={values.title}
              placeholder="Title"
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>
          <div className="form-group mb-2">
            <textarea
              name="body"
              rows="4"
              cols="30"
              value={values.body}
              placeholder="Body"
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-2">
            <button type="submit" className="btn btn-primary">
              Add new Article
            </button>
          </div>
        </form>
        <div className="mt-4 fs-5 font-monospace">
          <Link to="/articles">Go to Articles</Link>
        </div>
      </div>
    </div>
  );
}

export default CreateArticle;
