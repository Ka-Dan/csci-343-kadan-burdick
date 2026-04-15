import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { authenticated, unauthenticated } from "../../slices/authSlice.js";
import axios from "axios";

function AuthModal({ show, setShow, action }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  function handleSubmit (e) {
    e.preventDefault();

    if(action === "login") {
      login();
    } else if(action === "register") {
      register();
    }
  }

  function handleHide(e) {
    resetForm();
    setShow(false);
  }

  function resetForm() {
    setErrors({});
    setFormData({ email: "", password: "" });
  }

  function login(e) {
    axios.post("/api/auth/login", formData)
      .then(response => {
        console.log(response.data);
        dispatch(authenticated(response.data));
        resetForm();
        handleHide();
      })
      .catch(error => {
        dispatch(unauthenticated());

        if (error.response.status === 422) {
          setErrors(error.response.data.errors);
        }
        else if (error.response.status === 401) {
          setErrors({ email: "invalid email or password." });
        }
        else if (error.response.status === 404) {
          setErrors({ email: "user not found." });
        }
        else {
          setErrors({ email: "an error occurred. Please try again later." });
        }
      });
  }

  function register(e) {
    axios.post("/api/auth/register", formData)
      .then(response => {
        console.log(response.data);
        dispatch(authenticated(response.data));
        resetForm();
        handleHide();
      })
      .catch(error => {
        console.log(error.response.data.errors);
        dispatch(unauthenticated());
        setErrors(error.response.data.errors);
      });
  }

  return (
    <Modal show={show} onHide={(e) => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{action === "login" ? "Log In" : "Register"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={formData.email}
            isInvalid={!!errors.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          <Form.Label className="mt-3">Password</Form.Label>
          <Form.Control
            type="password"
            value={formData.password}
            isInvalid={!!errors.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>

          <div className="mt-3 text-end">
            <Button type="submit" className="me-2">{action === "login" ? "Log In" : "Register"}</Button>
            <Button variant="secondary" onClick={handleHide}>Cancel</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AuthModal;