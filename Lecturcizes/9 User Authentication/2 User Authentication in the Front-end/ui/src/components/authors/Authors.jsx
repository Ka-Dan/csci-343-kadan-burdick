import { useState, useEffect } from "react";
import { Table, Button, Alert, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Author from "./Author";

const Authors = () => {
  const auth = useSelector(state => state.auth);

  const [alerts, setAlerts] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchAuthors();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchAuthors = async () => {
    axios.get("api/authors")
      .then(response => {
        setAuthors(response.data);
        setAlerts([]);

        if (location.state?.alert) {
          setAlerts([...alerts, location.state.alert]);
          window.history.replaceState({}, "");
        }
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          setAlerts([...alerts, { message: "You must be logged in to view this page.", variant: "danger" }]);
        } else if (error.response?.status === 403) {
          setAlerts([...alerts, { message: "You do not have permission to view this page.", variant: "danger" }]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onDeleteClick = (e, authorId) => {
    e.preventDefault();

    if (window.confirm(`Are you sure you want to delete the author?`)) {
      axios.delete(`/api/authors/${authorId}`)
        .then(response => {
          setAuthors(prev => prev.filter(author => author.id !== authorId));
          setAlerts([...alerts, { message: "Author successfully deleted.", variant: "success" }]);
        })
        .catch(error => {
          if (error.response?.status === 401) {
            setAlerts([...alerts, { message: "You must be logged in to delete an author.", variant: "danger" }]);
          } else if (error.response?.status === 403) {
            setAlerts([...alerts, { message: "You do not have permission delete this author.", variant: "danger" }]);
          } else {
            setAlerts([...alerts, { message: "Failed to delete author.", variant: "danger" }]);
          }
        });
    }
  }

  return (
    <div>
      {alerts.map((alert, index) => (
        <Alert key={index} variant={alert.variant} dismissible>{alert.message}</Alert>
      ))}

      <h3>Authors</h3>

      {auth.isAdmin &&
        <div>
          <Button as={Link} to="/authors/new" className="mb-3">Add Author</Button>
        </div>
      }

      {isLoading ?
        <center>
          <Spinner />
        </center>
        :
        <>
          {authors.length > 0 ?
            <Table striped>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>First Name</th>
                  <th>Middle Name</th>
                  <th>Last Name</th>
                  <th style={{ width: "110px" }}></th>
                </tr>
              </thead>
              <tbody>
                {authors.map((author) => (
                  <Author key={author.id} author={author} onDeleteClick={(e) => onDeleteClick(e, author.id)} />
                ))}
              </tbody>
            </Table>
            :
            <p>No authors available.</p>
          }
        </>
      }
    </div>
  );
}

export default Authors;