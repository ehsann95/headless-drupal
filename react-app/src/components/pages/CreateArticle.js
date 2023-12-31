import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import Input from "../atoms/Input";
import { userLogin } from "../../utils/auth";

const auth = userLogin();

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

    const fetchUrl = `jsonapi/node/article`;

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

    const fetchOptions = {
      method: "POST",
      headers: new Headers({
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      }),
      body: JSON.stringify(body),
    };

    try {
      auth
        .fetchWithAuthentication(fetchUrl, fetchOptions)
        .then((response) => response.json())
        .then((data) => {
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
        });
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
            <Input
              name="title"
              type="text"
              value={values.title}
              placeholder="Title"
              handleChange={handleInputChange}
              required
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
            <Button type="submit">Add new Article</Button>
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
