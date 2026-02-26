import { useState } from "react";
import { Button, Alert } from "react-bootstrap";

function TodoAlert({task}) {
  return (
    <>
      <Alert variant="light">
        <p>
          {task}
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-success">
            Close me
          </Button>
        </div>
      </Alert>
    </>
  );
}

export default TodoModal;