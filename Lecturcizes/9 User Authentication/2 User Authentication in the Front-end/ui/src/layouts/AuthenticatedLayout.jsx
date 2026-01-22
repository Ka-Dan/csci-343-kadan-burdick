import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Unauthenticated from "../components/Unauthenticated";

const AuthenticatedLayout = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <>
      {isAuthenticated ? <Outlet /> : <Unauthenticated />}
    </>
  )
}

export default AuthenticatedLayout;