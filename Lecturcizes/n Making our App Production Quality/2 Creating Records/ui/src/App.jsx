import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import Authors from "./components/authors/Authors";
import NewAuthor from "./components/authors/NewAuthor";
import Books from "./components/books/Books";
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home/>} />
          <Route path="/authors" element={<Authors/>} />
          <Route path="/authors/new" element={<NewAuthor/>} />
          <Route path="/books" element={<Books/>} />
          <Route path="/*" element={<NotFound/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
