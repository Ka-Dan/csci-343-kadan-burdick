import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import Todo from "./components/Todo";
import Disclaimer from "./components/Disclaimer";
import NotFound from "./components/NotFound";
import Layout from "./components/layout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home/>} />
          <Route path="/todo" element={<Todo/>} />
          <Route path="/disclaimer" element={<Disclaimer/>} />
          <Route path="/*" element={<NotFound/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;