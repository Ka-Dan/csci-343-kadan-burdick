import { useState } from "react";
import { Button } from "react-bootstrap";
import TodoModal from "./TodoModal";

function TodoButton({ onAddTodo }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button onClick={() => setShow(true)}>Add task</Button>

      <TodoModal show={show} handleClose={() => setShow(false)} onSubmitTodo={onAddTodo}/>
    </>
  );
}

export default TodoButton;