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
    author: "",
    description: "",
    category: "",
    ingredient1: "",
    ingredient2: "",
    ingredient3: "",
    ingredient4: "",
    ingredient5: ""
  });

  useEffect(() => {
    if (!!recipe?.id) {
      setFormData({
        name: recipe.name || "",
        author: recipe.author || "",
        description: recipe.description || "",
        category: recipe.category || "",
        ingredient1: recipe.ingredient1 || "",
        ingredient2: recipe.ingredient2 || "",
        ingredient3: recipe.ingredient3 || "",
        ingredient4: recipe.ingredient4 || "",
        ingredient5: recipe.ingredient5 || ""
      });
    }
  }, [recipe]);

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
        if (error.response?.status === 400) {
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
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={formData.name}
            placeholder="Enter title"
            isInvalid={!!errors.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            value={formData.author}
            placeholder="Enter first name"
            isInvalid={!!errors.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.author}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            value={formData.description}
            placeholder="Enter description"
            isInvalid={!!errors.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            value={formData.category}
            placeholder="Enter category name"
            isInvalid={!!errors.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Ingredient 1</Form.Label>
          <Form.Control
            type="text"
            value={formData.ingredient1}
            placeholder="Enter ingredient"
            isInvalid={!!errors.ingredient1}
            onChange={(e) => setFormData({ ...formData, ingredient1: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.ingredient1}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Ingredient 2</Form.Label>
          <Form.Control
            type="text"
            value={formData.ingredient2}
            placeholder="Enter ingredient"
            isInvalid={!!errors.ingredient2}
            onChange={(e) => setFormData({ ...formData, ingredient2: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.ingredient2}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Ingredient 3</Form.Label>
          <Form.Control
            type="text"
            value={formData.ingredient3}
            placeholder="Enter ingredient"
            isInvalid={!!errors.ingredient3}
            onChange={(e) => setFormData({ ...formData, ingredient3: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.ingredient3}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Ingredient 4</Form.Label>
          <Form.Control
            type="text"
            value={formData.ingredient4}
            placeholder="Enter ingredient"
            isInvalid={!!errors.ingredient4}
            onChange={(e) => setFormData({ ...formData, ingredient4: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.ingredient4}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Ingredient 5</Form.Label>
          <Form.Control
            type="text"
            value={formData.ingredient5}
            placeholder="Enter ingredient"
            isInvalid={!!errors.ingredient5}
            onChange={(e) => setFormData({ ...formData, ingredient5: e.target.value })}
          />
          <Form.Control.Feedback type="invalid">{errors.ingredient5}</Form.Control.Feedback>
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