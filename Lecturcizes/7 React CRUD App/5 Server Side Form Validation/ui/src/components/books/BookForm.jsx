import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { useEffect } from "react";

function BookForm({ book }) {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [errors, setErrors] = useState({ });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", author: "" });

  useEffect(() => {
    if (!!book?.id) {
      setFormData({
        name: book.name || "",
        author: book.author || "",
      });
    }
  }, [book]);

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);

    const apiCall = !!book?.id ? axios.put(`/api/books/${book.id}`, formData) : axios.post("/api/books", formData);

    apiCall
      .then(response => {
        navigate("/books", { state: { alert: { message: `Book successfully ${!!book?.id ? "updated" : "created" }.`, variant: "success" } } });
      })
      .catch(error => {
        if (error.response?.status === 400) {
          console.log(error.response.data.errors);
          setErrors(error.response.data.errors);
        }
        else {
          setAlert({ message: `Failed to ${!!book?.id ? "update" : "create" } book.`, variant: "danger" });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <>
      {!!alert.message &&
        <Alert
          className="text-center"
          variant={alert.variant}
          onClose={() => setAlert({ message: "", type: "" })}
          dismissible
        >
          {alert.message}
        </Alert>
      }

      <Form className="w-50" onSubmit={isSubmitting ? null : handleSubmit}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={formData.name}
            placeholder="Enter title"
            isInvalid={!!errors.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            value={formData.author}
            placeholder="Enter first name"
            isInvalid={!!errors.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.author}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-4">
          <Button variant="primary" type="submit" className="me-2">Save</Button>
          <Button variant="secondary" type="button" as={Link} to="/books">Cancel</Button>
        </Form.Group>
      </Form>
    </>
  );
}

export default BookForm;
