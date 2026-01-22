import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Dogs() {
  return (
    <Container className="pt-3">
      <h3>Dogs are Great</h3>
      <div>
        <NavLink to="/">Home</NavLink>
      </div>
      <p>Dogs make great pets.</p>

      <img
        src="https://www.thesprucepets.com/thmb/mjUFLdsMqhggvgc4WNhuzfs3CQ0=/2094x0/filters:no_upscale():strip_icc()/portrait-if-a-spitz-pomeranian_t20_v3o29E-5ae9bbdca18d9e0037d95983.jpg"
        style={{width: "900px"}}
        alt=""
      />
    </Container>
  );
}

export default Dogs;