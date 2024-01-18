import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { useForm } from "react-hook-form";
import { userLogin } from "../../utils/auth";

const auth = userLogin();

function CreateArticle() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const [isSubmitting, setSubmitting] = useState(false);

  const [result, setResult] = useState({
    success: null,
    error: null,
    message: "",
  });

  const onSubmit = async (form) => {
    setSubmitting(true);

    const fetchUrl = `jsonapi/node/article`;

    const body = {
      data: {
        type: "node--article",
        attributes: {
          title: `${form.title}`,
          body: {
            value: `${form.body}`,
            format: "plain_text",
          },
        },
      },
    };

    const fetchOptions = {
      method: "POST",
      data: body,
    };

    try {
      const response = await auth.fetchWithAuthentication(
        fetchUrl,
        fetchOptions
      );
      const data = response.data;

      setSubmitting(false);
      // Clears form
      reset();
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
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="form-group mb-2">
            <input
              name="title"
              className="form-control"
              type="text"
              placeholder="Title"
              {...register("title", { required: "Title field is required" })}
            />
            <span className="text-danger small">{errors.title?.message}</span>
          </div>
          <div className="form-group mb-2">
            <textarea
              name="body"
              rows="4"
              cols="30"
              placeholder="Body"
              className="form-control"
              {...register("body", { required: "Body field is required" })}
            />
            <span className="text-danger small">{errors.body?.message}</span>
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
