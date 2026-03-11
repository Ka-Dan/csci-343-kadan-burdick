import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import Recipes from "./components/recipes/Recipes";
import NewRecipe from "./components/recipes/NewRecipe";
import EditRecipe from "./components/recipes/EditRecipe";
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/new" element={<NewRecipe />} />
          <Route path="/recipes/:id/edit" element={<EditRecipe />} />
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;