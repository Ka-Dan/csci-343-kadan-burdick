import { useSelector } from "react-redux";

function Home() {
  const { catViewCount, dogViewCount } = useSelector(state => state.views);

  return (
    <>
      <p>Welcome to my home page!</p>
      <div>Cat views: {catViewCount}</div>
      <div>Dog views: {dogViewCount}</div>
    </>
  );
}

export default Home;