import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import Books from "./components/books/Books";
import NewBook from "./components/books/NewBook";
import EditBook from "./components/books/EditBook";
import NotFound from "./components/NotFound";
import Authors from "./components/authors/Authors";
import NewAuthor from "./components/authors/NewAuthor";
import EditAuthor from "./components/authors/EditAuthor";
import ApplicationLayout from "./layouts/ApplicationLayout";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import AdminOnlyLayout from "./layouts/AdminOnlyLayout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<ApplicationLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/new" element={<NewBook />} />
          <Route path="/books/:id/edit" element={<EditBook />} />
          <Route element={<AuthenticatedLayout />}>
            <Route path="/authors" element={<Authors />} />
          </Route>
          <Route element={<AdminOnlyLayout />}>
            <Route path="/authors/new" element={<NewAuthor />} />
            <Route path="/authors/:id/edit" element={<EditAuthor />} />
          </Route>

          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
