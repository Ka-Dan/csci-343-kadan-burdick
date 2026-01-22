import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Alert, Container, Spinner, Table, Button } from "react-bootstrap";
import axios from "axios";

import Book from "./Book";

function Books() {
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/books")
      .then(response => {
        setBooks(response.data);
        setError(null);
      })
      .catch(error => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Container className="pt-3">
      {error && <Alert variant="danger" dismissible>Failed to load books.</Alert>}
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
              </tr>
            </thead>
            <tbody>
              {books.map(book => <Book key={book.id} book={book} />)}
            </tbody>
          </Table>
          :
          <>No books available</>
      }
    </Container>
  );
}

export default Books;