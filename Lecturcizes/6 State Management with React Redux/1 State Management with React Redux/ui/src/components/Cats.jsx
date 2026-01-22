import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { incrementCat } from "../slices/viewCountSlice";

function Cats() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(incrementCat());
  }, []);

  return (
    <>
      <h5>Cats are Great</h5>
      <p>Cats make great pets.</p>

      <img
        src="https://static.scientificamerican.com/sciam/cache/file/2AE14CDD-1265-470C-9B15F49024186C10_source.jpg?w=1200"
        className="img-fluid"
        style={{width: "900px"}}
        alt="" />
    </>
  );
}

export default Cats;