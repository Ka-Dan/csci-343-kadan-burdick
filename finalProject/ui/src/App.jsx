import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import Recipes from "./Components/recipes/Recipes";
import NewRecipe from "./components/recipes/NewRecipe";
import EditRecipe from "./components/recipes/EditRecipe";
import Categories from "./Components/categories/Categories";
import NewCategory from "./Components/categories/NewCategory";
import EditCategory from "./Components/categories/EditCategory";
import NotFound from "./components/NotFound";
import ApplicationLayout from "./layouts/ApplicationLayout";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import AdminOnlyLayout from "./layouts/AdminOnlyLayout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<ApplicationLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route element={<AuthenticatedLayout />}>
            <Route path="/recipes/new" element={<NewRecipe />} />
            <Route path="/recipes/:id/edit" element={<EditRecipe />} />
            <Route path="/categories" element={<Categories />} />
          </Route>
          <Route element={<AdminOnlyLayout/>}>
            <Route path="/categories/new" element={<NewCategory />} />
            <Route path="/categories/:id/edit" element={<EditCategory />} />
          </Route>
        </Route>

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;