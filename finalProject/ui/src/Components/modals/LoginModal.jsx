import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { authenticated } from "../../slices/authSlice.js";
import axios from "axios";

function LogInModal({ show, setShow }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  function handleSubmit (e) {
    e.preventDefault();
    axios.post("/api/auth/login", formData)
      .then(response => {
        console.log(response.data);
        dispatch(authenticated(response.data));
        setShow(false);
      })
      .catch(error => {
        dispatch(unauthenticated())
        setErrors(error.response.data);
      });
  }

  return (
    <Modal show={show} onHide={(e) => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={formData.email}
            isInvalid={!!errors.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={formData.password}
            isInvalid={!!errors.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>

          <div className="mt-3 text-end">
            <Button type="submit" className="me-2" onClick={handleSubmit}>Log In</Button>
            <Button variant="secondary" onClick={(e) => setShow(false)}>Cancel</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LogInModal;