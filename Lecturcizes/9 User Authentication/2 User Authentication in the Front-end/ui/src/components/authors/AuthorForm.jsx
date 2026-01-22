import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AuthorForm = ({author}) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [errors, setErrors] = useState({ });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    first_name: "",
    middle_name: "",
    last_name: ""
  });

  useEffect(() => {
    if (!!author?.id) {
      setFormData({
        title: author.title || "",
        first_name: author.first_name || "",
        last_name: author.last_name || "",
        middle_name: author.middle_name || "",
      });
    }
  }, [author]);

  const handleChange = (e, key) => {
    setErrors({ ...errors, [key]: "" });
    setFormData({ ...formData, [key]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);

    const apiCall = !!author?.id ? axios.put(`/api/authors/${author.id}`, formData) : axios.post("/api/authors", formData);

    apiCall
      .then(response => {
        navigate("/authors", { state: { alert: { message: `Author successfully ${!!author?.id ? "updated" : "created" }.`, variant: "success" } } });
      })
      .catch(error => {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        }
        if (error.response?.status === 401) {
          setAlert({ message: `You must be logged in to ${!!author?.id ? "update" : "create"} an author.`, variant: "danger" });
        } else if (error.response?.status === 403) {
          setAlert({ message: `You do not have permission to ${!!author?.id ? "update this author" : "create authors"}.`, variant: "danger" });
        }
        else {
          setAlert({ message: `Failed to ${!!author?.id ? "update" : "create" } author.`, variant: "danger" });
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

      <Form onSubmit={isSubmitting ? null : handleSubmit}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={formData.title}
            isInvalid={!!errors.title}
            onChange={(e) => handleChange(e, "title")}
          />
          <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={formData.first_name}
            isInvalid={!!errors.first_name}
            onChange={(e) => handleChange(e, "first_name")}
          />
          <Form.Control.Feedback type="invalid">{errors.first_name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>Middle Name</Form.Label>
          <Form.Control
            type="text"
            value={formData.middle_name}
            isInvalid={!!errors.middle_name}
            onChange={(e) => handleChange(e, "middle_name")}
          />
          <Form.Control.Feedback type="invalid">{errors.middle_name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={formData.last_name}
            isInvalid={!!errors.last_name}
            onChange={(e) => handleChange(e, "last_name")}
          />
          <Form.Control.Feedback type="invalid">{errors.last_name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-4">
          <Button variant="primary" type="submit" className="me-2">Save</Button>
          <Button variant="secondary" type="button" as={Link} to="/authors">Cancel</Button>
        </Form.Group>
      </Form>
    </>
  );
}

export default AuthorForm;