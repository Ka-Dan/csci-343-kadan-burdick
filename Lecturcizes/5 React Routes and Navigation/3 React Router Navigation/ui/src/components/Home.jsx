import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Home() {
  return (
    <Container className="pt-3">
      <h1>Home</h1>
      <p>Welcome to my home page!</p>
      <NavLink to="/cats" className="me-2">Cats</NavLink>
      <NavLink to="/dogs">Dogs</NavLink>
    </Container>
  );
}

export default Home;