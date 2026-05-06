import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Unauthorized from "../Components/Unauthorized";

const AdminOnlyLayout = () => {
  const { isAuthenticated, isAdmin } = useSelector(state => state.auth);

  return (
    <>
      {isAuthenticated && isAdmin ? <Outlet /> : <Unauthorized />}
    </>
  )
}

export default AdminOnlyLayout;