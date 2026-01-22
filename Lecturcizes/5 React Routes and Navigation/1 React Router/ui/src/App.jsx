import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import Cats from "./components/Cats";
import Dogs from "./components/Dogs";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/cats" element={<Cats/>} />
        <Route path="/dogs" element={<Dogs/>} />
      </Routes>
    </>
  );
}

export default App;
