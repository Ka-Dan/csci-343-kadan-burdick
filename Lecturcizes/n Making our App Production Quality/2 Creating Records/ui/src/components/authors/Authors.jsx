import { useState, useEffect } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
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
    <div className="pt-3">
      {error && <Alert variant="danger" dismissible>Failed to load authors.</Alert>}
      <h3>Authors</h3>
      <div>
        <Button as={Link} to="/authors/new" className="mb-3">Add author</Button>
      </div>

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
    </div>
  );
}

export default Authors;