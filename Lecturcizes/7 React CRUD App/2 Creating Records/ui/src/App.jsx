import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import Books from "./components/books/Books";
import NewBook from "./components/books/NewBook";
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/new" element={<NewBook />} />
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
