import { Button } from "react-bootstrap";

const CalculatorButton = ({clickHandler, btnText}) => {
  return (
    <Button className="me-1" onClick={clickHandler}>{btnText}</Button>
  );
}

export default CalculatorButton;