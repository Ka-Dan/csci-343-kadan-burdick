import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Alert, Container, Spinner, Button, Table } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";

import Category from "./category";

function Categories() {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isAdmin } = useSelector(state => state.auth);

  useEffect(() => {
    axios.get("/api/categories")
      .then(response => {
        setCategories(response.data);
        setAlert({ message: "", variant: "" });

        if (location.state?.alert) {
          setAlert(location.state.alert);
          window.history.replaceState({}, '');
        }
      })
      .catch(error => {
        setAlert({ message: "Failed to load categories", variant: "danger" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onDeleteClick = (e, category) => {
    e.preventDefault();
    const categoryId = category.id;

    if (window.confirm(`Are you sure you want to delete the category, ${category.name}?`)) {
      axios.delete(`/api/categories/${categoryId}`)
        .then(response => {
          setCategories(prev => prev.filter(category => category.id !== categoryId));
          setAlert({ message: "Category successfully deleted.", variant: "success" });
        })
        .catch(error => {
          console.log(error);
          setAlert({ message: "Failed to delete category.", variant: "danger" });
        });
    }
  }

  return (
    <Container className="pt-3">
      {!!alert.message && <Alert variant={alert.variant} dismissible>{alert.message}</Alert>}


      <h3>categories</h3>

      {isAuthenticated && isAdmin
      ?
      <div>
        <Button as={Link} to="/categories/new" className="mb-3">Add category</Button>
      </div>
      :
      <>
      </>
      }


      {isLoading
        ?
        <Spinner />
        :
        categories.length > 0
          ?
          <Table bordered striped hover>
            <thead>
              <tr>
                <th>Name</th>
                <th style={{ width: "110px" }}></th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => <Category key={category.id} category={category} onDeleteClick={onDeleteClick} />)}
            </tbody>
          </Table>
          :
          <>No categories available</>
      }
    </Container>
  );
}

export default Categories;