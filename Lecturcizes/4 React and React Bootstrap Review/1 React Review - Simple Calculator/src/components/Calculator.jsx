import { useRef, useState } from "react";

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
    <center>
      <div id="calculator">
        <h3>Simple Calculator</h3>
        <form>
          {/*
          * when we want to use the style tag in an element within JSX, we need to use an expression
          * that we populate with an object. Each key/value pair is a style rule.
          *
          * Note that when the styles are converted to camel case. So style with a dash - like
          * padding-bottom - would become paddingBottom.
          */}
          <div style={{paddingBottom: "5px"}}>
            <label htmlFor="x">x: </label>
            <input type="number" ref={x} />
          </div>
          <div style={{paddingBottom: "15px"}}>
            <label htmlFor="y">y: </label>
            <input type="number" ref={y} />
          </div>
          <button type="button" style={{marginRight: "5px"}} onClick={add}>Add</button>
          <button type="button" style={{marginRight: "5px"}} onClick={subtract}>Subtract</button>
          <button type="button" onClick={clear}>Clear</button>
        </form>
        <div className="results-container">
          <span>Result: <span>{result}</span></span>
        </div>
      </div>
    </center>
  );
}

export default Calculator;