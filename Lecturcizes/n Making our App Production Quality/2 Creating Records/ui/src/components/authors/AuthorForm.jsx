import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

import axios from "axios";

function AuthorForm() {
  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", first_name: "", middle_name: "", last_name: "" });

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);

    axios.post("/api/authors", formData)
      .then(response => {
        setAlert({ message: "Author successfully created.", variant: "success" });
      })
      .catch(error => {
        setAlert({ message: "Failed to create author.", variant: "danger" });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <>
      {alert.message ? <Alert className="text-center" variant={alert.variant} onClose={() => setAlert({message: "", type: ""})} dismissible>{alert.message}</Alert> : null}

      <Form className="w-50" onSubmit={isSubmitting ? null : handleSubmit}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={formData.title}
            placeholder="Enter title"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>First name</Form.Label>
          <Form.Control
            type="text"
            value={formData.first_name}
            placeholder="Enter first name"
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Middle name</Form.Label>
          <Form.Control
            type="text"
            value={formData.middle_name}
            placeholder="Enter middle name"
            onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            type="text"
            value={formData.last_name}
            placeholder="Enter last name"
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
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
