import { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  }

  const decrement = () => {
    setCount(count - 1);
  }

  const incrementFive = () => {
    for (let i = 0; i < 5; i++) {
      /**
       * We may be tempted to use this:
       * setCount(count + 1);
       *
       * However, this will not work as expected. The reason is that the setCount function is asynchronous
       * and does not immediately update the state. Instead, it schedules an update to the state.
       *
       * By the time the update is scheduled, the for loop has already finished and the value of count
       * has already been updated 5 times but at the time of the update, the value of count is still the original value.
       * So, the update will only increment the count by 1 instead of 5.
       *
       * To fix this, we can use the current parameter of the setCount function to get the current value of count.
       */
      setCount(prevCount => prevCount + 1);
    }
  }

  return (
    <Container>
      <center>
        <h1 className="mt-3 pb-2">Counter</h1>
        <h2>{count}</h2>
        <div className=''>
          <Button className="me-1" onClick={increment}>Increment</Button>
          <Button className="me-1" onClick={decrement}>Decrement</Button>
          <Button onClick={incrementFive}>Increment 5 times</Button>
        </div>
      </center>
    </Container>
  );
}

export default App;
