import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import Cats from "./components/Cats";
import Dogs from "./components/Dogs";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/cats" element={<Cats/>} />
        <Route path="/dogs" element={<Dogs/>} />
        <Route path="/*" element={<NotFound/>} />
      </Routes>
    </>
  );
}

export default App;
