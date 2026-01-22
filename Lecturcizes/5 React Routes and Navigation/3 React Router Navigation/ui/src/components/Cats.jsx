import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Cats() {
  return (
    <Container className="pt-3">
      <h3>Cats are Great</h3>
      <div>
        <NavLink to="/">Home</NavLink>
      </div>
      <p>Cats make great pets.</p>

      <img
        src="https://static.scientificamerican.com/sciam/cache/file/2AE14CDD-1265-470C-9B15F49024186C10_source.jpg?w=1200"
        style={{width: "900px"}}
        alt="" />
    </Container>
  );
}

export default Cats;