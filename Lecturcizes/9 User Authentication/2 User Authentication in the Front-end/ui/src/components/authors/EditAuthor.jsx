import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Alert, Spinner } from "react-bootstrap";
import AuthorForm from "./AuthorForm";

const EditAuthor = () => {
  const params = useParams();
  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [author, setAuthor] = useState({
    title: "",
    first_name: "",
    middle_name: "",
    last_name: ""
  });

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = () => {
    axios.get(`/api/authors/${params.id}`)
      .then(results => {
        setAuthor({
          id: results.data.id,
          title: results.data.title || "",
          first_name: results.data.first_name || "",
          middle_name: results.data.middle_name || "",
          last_name: results.data.last_name || "",
        });
      })
      .catch(error => {
        setAlert({ message: "Failed to load author.", variant: "danger" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <h3>Edit Author</h3>

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
        : !!!alert.message && <AuthorForm author={author} />
      }
    </>
  );
}

export default EditAuthor;