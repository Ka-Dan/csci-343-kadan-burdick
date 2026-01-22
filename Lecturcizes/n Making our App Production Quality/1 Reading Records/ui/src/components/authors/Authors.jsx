import { useState, useEffect } from "react";
import { Container, Spinner, Table } from "react-bootstrap";
import axios from "axios";

import Author from "./Author";

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/authors")
      .then(response => {
        setAuthors(response.data);
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
      {error && <Alert variant="danger" dismissible>Failed to load authors.</Alert>}
      <h3>Authors</h3>
      {isLoading
      ?
        <Spinner />
      :
        authors.length > 0
        ?
          <Table bordered striped hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Last Name</th>
              </tr>
            </thead>
            <tbody>
              {authors.map(author => <Author key={author.id} author={author} />)}
            </tbody>
          </Table>
        :
          <>No authors available</>
      }
    </Container>
  );
}

export default Authors;