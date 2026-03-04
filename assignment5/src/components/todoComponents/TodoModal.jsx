import { useRef, useState } from "react";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addTodo } from "./TodoSlice";

function TodoModal({ show, handleClose }) {
  const userInput = useRef(null);
  const maxLength = 100;
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    const trimmedInput = (userInput.current?.value || "").trim();

    setErrors({})

    if (!trimmedInput) {
      setErrors(prev => {
        return {...prev, task: "Task cannot be empty"}
      });
      valid = false;
    }

    if (trimmedInput.length > maxLength) {
      setErrors(prev => {
        return {...prev, task: "Task name is too long"}
      });
      valid = false;
    }

    if (valid) {
      dispatch(addTodo(trimmedInput));
      userInput.current.value = "";
    }
  }

  const handleReset = (e) => {
    e.preventDefault();
    userInput.current.value = "";
    setErrors({});
    handleClose(true);
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <InputGroup hasValidation className="mb-2">
              <Form.Control type="textarea" ref={userInput} placeholder="Enter task..." isInvalid={!!errors.task}/>
              <Form.Control.Feedback type="invalid">
                {errors.task}
              </Form.Control.Feedback>
            </InputGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" className="mt-3" onClick={handleSubmit}>Add</Button>
          <Button variant="secondary" className="mt-3" onClick={handleReset}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TodoModal;