import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Alert, Container, Spinner, Table, Button } from "react-bootstrap";
import axios from "axios";

import Book from "./Book";

function Books() {
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/books")
      .then(response => {
        setBooks(response.data);
        setAlert({ message: "", variant: "" });

        if (location.state?.alert) {
          setAlert(location.state.alert);
          window.history.replaceState({}, '');
        }
      })
      .catch(error => {
        setAlert({ message: "Failed to load books", variant: "danger" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onDeleteClick = (e, book) => {
    e.preventDefault();
    const bookId = book.id;

    if (window.confirm(`Are you sure you want to delete the book, ${book.name}?`)) {
      axios.delete(`/api/books/${bookId}`)
        .then(response => {
          setBooks(prev => prev.filter(book => book.id !== bookId));
          setAlert({ message: "Book successfully deleted.", variant: "success" });
        })
        .catch(error => {
          console.log(error);
          setAlert({ message: "Failed to delete book.", variant: "danger" });
        });
    }
  }

  return (
    <Container className="pt-3">
      {!!alert.message && <Alert variant={alert.variant} dismissible>{alert.message}</Alert>}
      {location.state?.alert && <Alert variant={location.state.alert.variant} dismissible>{location.state.alert.message}</Alert>}

      <h3>Books</h3>

      <div>
        <Button as={Link} to="/books/new" className="mb-3">Add Book</Button>
      </div>

      {isLoading
        ?
        <Spinner />
        :
        books.length > 0
          ?
          <Table bordered striped hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th style={{ width: "110px" }}></th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => <Book key={book.id} book={book} onDeleteClick={onDeleteClick} />)}
            </tbody>
          </Table>
          :
          <>No books available</>
      }
    </Container>
  );
}

export default Books;