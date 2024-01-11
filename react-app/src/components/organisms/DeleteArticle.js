import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../../utils/auth";

const auth = userLogin();

function DeleteArticle({ id, title }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [result, setResult] = useState({
    success: null,
    error: null,
    message: "",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = async () => {
    let token = localStorage.getItem("access_token");

    const fetchUrl = `jsonapi/node/article/${id}`;
    const fetchOptions = {
      method: "DELETE",
      // headers: new Headers({}),
    };

    try {
      const response = await auth.fetchWithAuthentication(
        fetchUrl,
        fetchOptions
      );

      if (response.staus !== 204) {
        handleClose();
        setResult({
          success: false,
          error: true,
          message: <p className="text-danger">Error deleting the article</p>,
        });
      }

      setResult({
        success: true,
        error: false,
        message: <p className="text-success">Article Deleted successfully</p>,
      });

      navigate("/articles");
    } catch (error) {
      console.log("Error deleting the article", error);
    }
  };

  return (
    <div className="row top-buffer">
      <div>
        {(result.success || result.error) && (
          <div className="my-3">{result.message}</div>
        )}
      </div>
      <div>
        <Button variant="danger" onClick={handleShow}>
          Delete
        </Button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this article?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default DeleteArticle;
