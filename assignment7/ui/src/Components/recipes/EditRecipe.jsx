import RecipeForm from "./RecipeForm";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Alert, Spinner } from "react-bootstrap";
import axios from "axios";

function EditRecipe() {
  const params = useParams();
  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    author_id: "",
    category_id: "",
    ingredients: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, []);

  const fetchRecipe = () => {
    axios.get(`/api/recipes/${params.id}`)
    .then(results => {
      setRecipe({
        name: results.data.name || "",
        description: results.data.description || "",
        author_id: results.data.author_id || "",
        category_id: results.data.category_id || "",
        ingredients: results.data.ingredients || []
      });
    })
    .catch(error => {
      setAlert({ message: "Failed to load recipe data.", variant: "danger" });
    })
    .finally(() => {
      setIsLoading(false);
    });
  }

  return (
    <>
      <h3>Edit Recipe</h3>

      {!!alert.message &&
        <Alert
          className="text-center"
          variant={alert.variant}
          onClose={() => setAlert({ message: "", type: "" })}
          dismissible
        >
          {alert.message}
        </Alert>
      }

      {isLoading
        ? <Spinner />
        : !!!alert.message && <RecipeForm recipe={{...recipe, id: params.id}} />
      }
    </>
  );
}

export default EditRecipe;