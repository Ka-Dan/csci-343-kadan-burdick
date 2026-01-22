import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { useEffect } from "react";

function BookForm({ book }) {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [authors, setAuthors] = useState([]);
  const [errors, setErrors] = useState({ });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", author_id: "" });

  useEffect(() => {
    if (!!book?.id) {
      setFormData({
        title: book.title || "",
        author_id: book.author_id || "",
      });
    }
  }, [book]);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = () => {
    axios.get("/api/authors")
      .then(response => {
        setAuthors(response.data);
      })
      .catch(error => {
        setAlert({ message: "Failed to load authors.", variant: "danger" });
      });
  }

  const handleChange = (e, key) => {
    setErrors({ ...errors, [key]: "" });
    setFormData({ ...formData, [key]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);

    const apiCall = !!book?.id ? axios.put(`/api/books/${book.id}`, formData) : axios.post("/api/books", formData);

    apiCall
      .then(response => {
        navigate("/books", { state: { alert: { message: `Book successfully ${!!book?.id ? "updated" : "created" }.`, variant: "success" } } });
      })
      .catch(error => {
        if (error.response?.status === 422) {
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

  const authorName = (author) => {
    return [
      author.title || "",
      author.first_name || "",
      author.middle_name || "",
      author.last_name || ""
    ].join(" ");
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
            value={formData.title}
            placeholder="Enter title"
            isInvalid={!!errors.title}
            onChange={(e) => handleChange(e, "title")}
          />
          <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Author</Form.Label>
          <Form.Select
            value={formData.author_id}
            isInvalid={!!errors.author_id}
            onChange={(e) => handleChange(e, "author_id")}
          >
            <option value="">Select author</option>
            {authors.map(author => <option value={author.id} key={author.id}>{authorName(author)}</option>)}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errors.author_id}</Form.Control.Feedback>
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
