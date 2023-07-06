import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import DeleteArticle from "../organisms/DeleteArticle";
import Button from "react-bootstrap/Button";
import Input from "../atoms/Input";

function EditArticle() {
  const { id } = useParams();
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

  useEffect(() => {
    getArticle(id);
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const getArticle = async (id) => {
    if (!id) {
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}jsonapi/node/article/${id}`
      );
      const data = res.data.data?.attributes;
      let values = {
        title: data.title,
        body: data.body.value,
      };
      setValues(values);
    } catch (err) {
      console.log("Error fetching", err);
      setResult({
        success: false,
        error: true,
        message: <p className="text-danger">{err.message}</p>,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    const fetchUrl = `${process.env.REACT_APP_BASE_URL}jsonapi/node/article/${id}`;

    let body = {
      data: {
        type: "node--article",
        id: `${id}`,
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
      const res = await axios.patch(fetchUrl, body, {
        headers: headers,
      });
      const data = res.data;
      setSubmitting(false);
      // setValues(defaultValues);
      if (data.data.id) {
        setResult({
          success: true,
          message: (
            <div className="text-success">
              {"Updated"}: <em>{data.data.attributes.title}</em>
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
    <>
      <DeleteArticle id={id} title={values.title} />
      <div className="row top-buffer">
        <div>
          <h2>
            Edit Article: <em>{values.title}</em>
          </h2>
        </div>
        <div className="col">
          {(result.success || result.error) && (
            <div className="my-3">{result.message}</div>
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
              <Button type="submit" variant="primary">
                Update Article
              </Button>
            </div>
          </form>
          <div className="mt-4 fs-5 font-monospace">
            <Link to="/articles">Go to Articles</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditArticle;
