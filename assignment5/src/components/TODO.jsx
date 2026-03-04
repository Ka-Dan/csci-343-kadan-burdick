import { Container, Row, Col, Button } from 'react-bootstrap';
import TodoButton from './todoComponents/TodoButton';
import "../App.css";
import { useSelector, useDispatch } from 'react-redux';
import { deleteTodo } from './todoComponents/TodoSlice';

function TODO({}) {
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();

  function TaskRender() {
    return (
      <>
        {todos.length > 0 ? (
          <>
          {todos.map(todo => (
          <Row key={todo.id} className="todo-row">
            <Col xs={12} md={8} className="todo-item">{todo.text}</Col>
            <Col xs={12}md={8} className="align-item-center">
              <Button variant="success" className="justify-content-right" onClick={() => dispatch(deleteTodo(todo.id))}>Remove</Button>
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
          <TodoButton></TodoButton>
          <TaskRender></TaskRender>
        </Col>
      </Row>
    </Container>
  );
}

export default TODO;