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
        {/*
        * Since version 6, routes like this (/*) will not override more specific routes - regardless of
        * the order in which they were added. So essentially, this route says to match everything that
        * hasn't already been defined as a route.
        */}
        <Route path="/*" element={<NotFound/>} />
      </Routes>
    </>
  );
}

export default App;
