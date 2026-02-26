import { Container, Row, Col, Button } from 'react-bootstrap';
import TodoButton from './TodoButton';
import { useState } from 'react';
import "../App.css";


function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    setTodos([...todos, {id: Date.now(), text}])
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  function TaskRender() {
  return (
    <>
      {todos.length > 0 ? (
        <>
        {todos.map(todo => (
        <Row key={todo.id} className="todo-row">
          <Col xs={12} md={8} className="todo-item">{todo.text}</Col>
          <Col xs={12}md={8} className="align-item-center">
            <Button variant="success" className="justify-content-right" onClick={() => removeTodo(todo.id)}>Remove</Button>
          </Col>
        </Row>
      ))}
        </>
      ) : (
        <>
        <Row className="todo-row">
          <Col xs={12} md={8} className="todo-item">No Tasks Available</Col>
        </Row>
        </>
      )}
    </>
  );
}


  return (
    <Container className="align-items-center">
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={8}>
          <h1 className="todo-title mb-4">TODO List</h1>
          <TodoButton onAddTodo={addTodo}></TodoButton>
          <TaskRender></TaskRender>
        </Col>
      </Row>
    </Container>
  );
}

export default TodoList;
