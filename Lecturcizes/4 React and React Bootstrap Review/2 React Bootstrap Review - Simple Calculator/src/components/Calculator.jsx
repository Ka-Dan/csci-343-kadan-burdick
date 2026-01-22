import { useRef, useState } from "react";
import { Container, Button, Form, InputGroup } from "react-bootstrap";

const Calculator = () => {
  const x = useRef(null);
  const y = useRef(null);
  const [result, setResult] = useState("n/a");

  const add = (e) => {
    e.preventDefault();

    const xValue = parseFloat(x.current.value);
    const yValue = parseFloat(y.current.value);

    setResult(xValue + yValue);
  }

  const subtract = (e) => {
    e.preventDefault();

    const xValue = parseFloat(x.current.value);
    const yValue = parseFloat(y.current.value);

    setResult(xValue - yValue);
  }

  const clear = (e) => {
    e.preventDefault();
    x.current.value = null;
    y.current.value = null;
    setResult("n/a");
  }

  return (
    <Container className="mt-3">
      <center>
        <div id="calculator" className="border rounded py-2 px-3" style={{width: "280px"}}>
          <h3 className="pt-1 mb-2">Simple Calculator</h3>
          <Form>
            <InputGroup className="mb-2">
              <InputGroup.Text>x</InputGroup.Text>
              <Form.Control type="number" ref={x} />
            </InputGroup>
            <InputGroup className="mb-2">
              <InputGroup.Text>y</InputGroup.Text>
              <Form.Control type="number" ref={y} />
            </InputGroup>

            <div className="mt-3">
              <Button className="me-1" onClick={add}>Add</Button>
              <Button className="me-1" onClick={subtract}>Subtract</Button>
              <Button className="me-1" onClick={clear}>Clear</Button>
            </div>
          </Form>
          <div className="mt-2">
            <span>Result: <span>{result}</span></span>
          </div>
        </div>
      </center>
    </Container>
  );
}

export default Calculator;