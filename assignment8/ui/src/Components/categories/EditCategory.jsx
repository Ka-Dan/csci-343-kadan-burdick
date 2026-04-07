import CategoryForm from "./CategoryForm";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Alert, Spinner } from "react-bootstrap";
import axios from "axios";

function EditCategory() {
  const params = useParams();
  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [category, setCategory] = useState({ name: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = () => {
    axios.get(`/api/categories/${params.id}`)
      .then(results => {
        setCategory({
          name: results.data.name || ""
        });
      })
      .catch(error => {
        setAlert({ message: "Failed to load results.data.", variant: "danger" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <h3>Edit Category</h3>

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
        : !!!alert.message && <CategoryForm category={{...category, id: params.id}} />
      }
    </>
  );
}

export default EditCategory;