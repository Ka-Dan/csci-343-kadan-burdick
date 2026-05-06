import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Alert, Container, Spinner, Button, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";

import Recipe from "./Recipe";

function Recipes() {
  const location = useLocation();
  const [recipes, setrecipes] = useState([]);
  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isAdmin } = useSelector(state => state.auth);

  useEffect(() => {
    axios.get("/api/recipes")
      .then(response => {
        setrecipes(response.data);
        setAlert({ message: "", variant: "" });

        if (location.state?.alert) {
          setAlert(location.state.alert);
          window.history.replaceState({}, '');
        }
      })
      .catch(error => {
        setAlert({ message: "Failed to load recipes", variant: "danger" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onDeleteClick = (e, recipe) => {
    e.preventDefault();
    const recipeId = recipe.id;

    if (window.confirm(`Are you sure you want to delete the recipe, ${recipe.name}?`)) {
      axios.delete(`/api/recipes/${recipeId}`)
        .then(response => {
          setrecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
          setAlert({ message: "Recipe successfully deleted.", variant: "success" });
        })
        .catch(error => {
          console.log(error);
          setAlert({ message: "Failed to delete recipe.", variant: "danger" });
        });
    }
  }

  return (
    <Container className="pt-3">
      {!!alert.message && <Alert variant={alert.variant} dismissible>{alert.message}</Alert>}


      <h3>recipes</h3>

      <>
      {isAuthenticated && isAdmin ?
        <div>
          <Button as={Link} to="/recipes/new" className="mb-3">Add recipe</Button>
        </div>
        :
        <>
        </>
      }
      </>



      {isLoading
        ?
        <Spinner />
        :
        recipes.length > 0
          ?
          <Row>
            {recipes.map(recipe => (
              <Col xs={12} sm={12} md={6} lg={4} xl={3} xxl={3} key={recipe.id}>
                <Recipe recipe={recipe} onDeleteClick={onDeleteClick} />
              </Col>
            ))}
          </Row>
          :
          <>No recipes available</>
      }
    </Container>
  );
}

export default Recipes;