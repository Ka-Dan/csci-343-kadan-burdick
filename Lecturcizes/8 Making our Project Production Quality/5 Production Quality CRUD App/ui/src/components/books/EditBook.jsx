import BookForm from "./BookForm";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Alert, Spinner } from "react-bootstrap";
import axios from "axios";

function EditBook() {
  const params = useParams();
  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [book, setBook] = useState({ title: "", author_id: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = () => {
    axios.get(`/api/books/${params.id}`)
      .then(results => {
        setBook({
          id: results.data.id,
          title: results.data.title,
          author_id: results.data.author.id
        });
      })
      .catch(error => {
        setAlert({ message: "Failed to load book.", variant: "danger" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <h3>Edit Book</h3>

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
        : !!!alert.message && <BookForm book={{...book, id: params.id}} />
      }
    </>
  );
}

export default EditBook;
