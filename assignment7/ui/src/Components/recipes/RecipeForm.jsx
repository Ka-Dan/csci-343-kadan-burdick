import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { useEffect } from "react";

function RecipeForm({ recipe }) {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [errors, setErrors] = useState({ });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    author_id: "",
    ingredient_ids: []
  });

  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  // Fetch Lists
  useEffect(() => {
    axios.get("/api/ingredients").then(res => setIngredients(res.data));
    axios.get("/api/categories").then(res => setCategories(res.data));
    axios.get("/api/authors").then(res => setAuthors(res.data));
  }, []);

  // Runs when recipe prop arrives
  useEffect(() => {
  if (recipe && recipe.id) {
    setFormData({
      name: recipe.name || "",
      description: recipe.description || "",
      author_id: recipe.author_id ? recipe.author_id.toString() : "",
      category_id: recipe.category_id ? recipe.category_id.toString() : "",
      ingredient_ids: Array.isArray(recipe.ingredients)
        ? recipe.ingredients.map(ing => ing.id.toString())
        : []
    });
  }
}, [recipe, ingredients]);

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);

    const apiCall = !!recipe?.id ? axios.put(`/api/recipes/${recipe.id}`, formData) : axios.post("/api/recipes", formData);

    apiCall
      .then(response => {
        navigate("/recipes", { state: { alert: { message: `Recipe successfully ${!!recipe?.id ? "updated" : "created" }.`, variant: "success" } } });
      })
      .catch(error => {
        if (error.response?.status === 422) {
          console.log(error.response.data.errors);
          setErrors(error.response.data.errors);
        }
        else {
          setAlert({ message: `Failed to ${!!recipe?.id ? "update" : "create" } recipe.`, variant: "danger" });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <>
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

      <Form className="w-50" onSubmit={isSubmitting ? null : handleSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={formData.name}
            placeholder="Enter name"
            isInvalid={!!errors.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="textarea"
            value={formData.description}
            placeholder="Enter description"
            isInvalid={!!errors.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Author</Form.Label>
          <Form.Control
            as="select"
            value={formData.author_id}
            isInvalid={!!errors.author_id}
            onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
          >
            <option value="">Select Author</option>
              {authors.map((auth) => (
                <option key={auth.id} value={auth.id.toString()}>
                  {auth.name}
                </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">{errors.author_id}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={formData.category_id}
            isInvalid={!!errors.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          >
            <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">{errors.category_id}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Ingredients</Form.Label>
          <Form.Control
            as="select"
            multiple
            value={formData.ingredient_ids}
            isInvalid={!!errors.ingredient_ids}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
              setFormData({ ...formData, ingredient_ids: values });
            }}
          >
            {ingredients.map((ing) => (
              <option key={ing.id} value={ing.id.toString()}>
                {ing.name}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.ingredient_ids}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-4">
          <Button variant="primary" type="submit" className="me-2">Save</Button>
          <Button variant="secondary" type="button" as={Link} to="/recipes">Cancel</Button>
        </Form.Group>
      </Form>
    </>
  );
}

export default RecipeForm;