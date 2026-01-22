import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import Cats from "./components/Cats";
import Dogs from "./components/Dogs";
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home/>} />
          <Route path="/cats" element={<Cats/>} />
          <Route path="/dogs" element={<Dogs/>} />
          <Route path="/*" element={<NotFound/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
