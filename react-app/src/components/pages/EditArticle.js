import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import DeleteArticle from "../organisms/DeleteArticle";
import Button from "react-bootstrap/Button";
import { userLogin } from "../../utils/auth";

const auth = userLogin();

function EditArticle() {
  const { id } = useParams();
  const {
    handleSubmit,
    control,
    setValue,
    register,
    formState: { errors },
  } = useForm();
  const [result, setResult] = useState({
    success: null,
    error: null,
    message: "",
    title: "",
  });

  useEffect(() => {
    getArticle(id);
  }, [id]);

  const getArticle = async (id) => {
    if (!id) {
      return;
    }

    try {
      const res = await auth.fetchWithAuthentication(
        `${process.env.REACT_APP_BASE_URL}jsonapi/node/article/${id}`
      );
      const data = res.data.data?.attributes;

      // Use setValue to set form values
      setValue("title", data.title);
      setValue("body", data.body.value);
      setResult({ ...result, title: data.title });
    } catch (err) {
      console.log("Error fetching", err);
      setResult({
        success: false,
        error: true,
        message: <p className="text-danger">{err.message}</p>,
      });
    }
  };

  const onSubmit = async (data) => {
    const fetchUrl = `jsonapi/node/article/${id}`;

    const body = {
      data: {
        type: "node--article",
        id: `${id}`,
        attributes: {
          title: `${data.title}`,
          body: {
            value: `${data.body}`,
            format: "plain_text",
          },
        },
      },
    };

    const fetchOptions = {
      method: "PATCH",
      data: body,
    };

    try {
      const response = await auth.fetchWithAuthentication(
        fetchUrl,
        fetchOptions
      );
      const responseData = response.data;

      if (responseData.data.id) {
        setResult({
          success: true,
          message: (
            <div className="text-success">
              {"Updated"}: <em>{responseData.data.attributes.title}</em>
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
    }
  };

  return (
    <>
      <DeleteArticle id={id} title={result.title} />
      <div className="row top-buffer">
        <div>
          <h2>
            Edit Article: <em>{result.title}</em>
          </h2>
        </div>
        <div className="col">
          {(result.success || result.error) && (
            <div className="my-3">{result.message}</div>
          )}

          <form
            className="col-md-6 offset-md-3 text-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="form-group mb-2">
              <Controller
                name="title"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    name="title"
                    type="text"
                    className="form-control"
                    value={field.value}
                    placeholder="Title"
                    handleChange={(e) => {
                      field.onChange(e);
                    }}
                    {...register("title", { required: "Required field" })}
                  />
                )}
              />
              <span className="text-danger small">{errors.title?.message}</span>
            </div>
            <div className="form-group mb-2">
              <Controller
                name="body"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <textarea
                    name="body"
                    rows="4"
                    cols="30"
                    value={field.value}
                    placeholder="Body"
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    className="form-control"
                    {...register("body", {
                      required: "Body field is required",
                    })}
                  />
                )}
              />
              <span className="text-danger small">{errors.body?.message}</span>
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
