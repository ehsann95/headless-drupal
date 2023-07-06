import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    const fetchUrl = `${process.env.REACT_APP_BASE_URL}jsonapi/node/article/${id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      credentials: "same-origin",
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Cache: "no-cache",
    };

    try {
      const res = await axios.delete(fetchUrl, headers);
      if (res.status === 204) {
        handleClose();
        setResult({
          success: true,
          error: false,
          message: <p className="text-success">Article Deleted successfully</p>,
        });
        navigate("/articles");
      }
    } catch (err) {
      handleClose();
      setResult({
        success: false,
        error: true,
        message: (
          <p className="text-danger">{err.response?.data?.errors[0].detail}</p>
        ),
      });
      console.log("Error deleting the article", err);
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
