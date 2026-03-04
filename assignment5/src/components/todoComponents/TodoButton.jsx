import { useState } from "react";
import { Button } from "react-bootstrap";
import TodoModal from "./TodoModal";

function TodoButton({}) {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button onClick={() => setShow(true)} className="mb-2">Add task</Button>

      <TodoModal show={show} handleClose={() => setShow(false)}/>
    </>
  );
}

export default TodoButton;