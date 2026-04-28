import { Container } from "react-bootstrap";

function NotFound() {
  return (
    <Container className="pt-3">
      <h3>Oops!</h3>
      <p>It looks like the page you are looking for doesn't exist.</p>
    </Container>
  );
}

export default NotFound;