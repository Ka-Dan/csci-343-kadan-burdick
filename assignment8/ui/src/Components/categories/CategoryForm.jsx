import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { useEffect } from "react";

function CategoryForm({ category }) {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [errors, setErrors] = useState({ });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    if (!!category?.id) {
      setFormData({ name: category.name || "" });
    }
  }, [category]);

  const handleChange = (e, key) => {
    setErrors({ ...errors, [key]: "" });
    setFormData({ ...formData, [key]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);

    const apiCall = !!category?.id ? axios.put(`/api/categories/${category.id}`, formData) : axios.post("/api/categories", formData);

    apiCall
      .then(response => {
        navigate("/categories", { state: { alert: { message: `Category successfully ${!!category?.id ? "updated" : "created" }.`, variant: "success" } } });
      })
      .catch(error => {
        if (error.response?.status === 422) {
          console.log(error.response.data.errors);
          setErrors(error.response.data.errors);
        }
        else {
          setAlert({ message: `Failed to ${!!category?.id ? "update" : "create" } category.`, variant: "danger" });
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
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={formData.name}
            placeholder="Enter name"
            isInvalid={!!errors.category}
            onChange={(e) => handleChange( e, "name")}
          />
          <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-4">
          <Button variant="primary" type="submit" className="me-2">Save</Button>
          <Button variant="secondary" type="button" as={Link} to="/categories">Cancel</Button>
        </Form.Group>
      </Form>
    </>
  );
}

export default CategoryForm;