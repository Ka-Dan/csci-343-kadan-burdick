import { useRef, useState } from "react";
import { Container, Button, Form, InputGroup } from "react-bootstrap";

const Calculator = () => {
  const x = useRef(null);
  const y = useRef(null);
  const [result, setResult] = useState("n/a");
  const [errors, setErrors] = useState({});

  const add = (e) => {
    e.preventDefault();

    const xValue = parseFloat(x.current.value);
    const yValue = parseFloat(y.current.value);

    let valid = true;
    setErrors({});

    if(isNaN(xValue)) {
      /**
       * Here you are being introduced to the overridden state setter that takes a parameter:
       * the previous state.
       *
       * It is best practice to use this version when your new state depends on the previous
       * state - especially when you are using the same state setter more than once in the same
       * function (because the state setter is asynchronous and so the results could be unpredicable).
       */
      setErrors((prevState) => {
        return {...prevState, x: "must be a number"}
      });
      valid = false;
    }

    if(isNaN(yValue)) {
      setErrors((prevState) => {
        return {...prevState, y: "must be a number"}
      });
      valid = false;
    }

    if(valid) {
      setResult(xValue + yValue);
    }
  }

  const subtract = (e) => {
    e.preventDefault();

    const xValue = parseFloat(x.current.value);
    const yValue = parseFloat(y.current.value);

    let valid = true;
    setErrors({});

    if(isNaN(xValue)) {
      setErrors((prevState) => {
        return {...prevState, x: "must be a number"}
      });
      valid = false;
    }

    if(isNaN(yValue)) {
      setErrors((prevState) => {
        return {...prevState, y: "must be a number"}
      });
      valid = false;
    }

    if(valid) {
      setResult(xValue - yValue);
    }
  }

  const clear = (e) => {
    e.preventDefault();
    x.current.value = null;
    y.current.value = null;
    setResult("n/a");
    setErrors({});
  }

  return (
    <Container className="mt-3">
      <center>
        <div id="calculator" className="border rounded py-2 px-3" style={{width: "280px"}}>
          <h3 className="pt-1 mb-2">Simple Calculator</h3>
          <Form>
            <InputGroup hasValidation className="mb-2">
              <InputGroup.Text>x</InputGroup.Text>
              <Form.Control type="number" ref={x} isInvalid={!!errors.x} />
              <Form.Control.Feedback type="invalid" className="text-start">
                {errors.x}
              </Form.Control.Feedback>
            </InputGroup>
            <InputGroup hasValidation className="mb-2">
              <InputGroup.Text>y</InputGroup.Text>
              <Form.Control type="number" ref={y} isInvalid={!!errors.y} />
              <Form.Control.Feedback type="invalid" className="text-start">
                {errors.y}
              </Form.Control.Feedback>
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