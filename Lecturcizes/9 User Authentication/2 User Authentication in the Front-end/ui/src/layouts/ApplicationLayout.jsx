import { useEffect, useState } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { unauthenticated } from "../slices/authSlice";
import { verifyToken } from "../actions/authActions";
import axios from "axios";

import AuthModal from "../components/modals/AuthModal";

function ApplicationLayout() {
  const location = useLocation();
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState("");

  /*
  * We want to verify the token on every page load in case the jwt expires or otherwise becomes invalid.
  * We also want to verify the token when the user navigates to a new page.
  *
  * We use the location.pathname to trigger the useEffect hook when the user navigates to a new page.
  * We need this because the useEffect hook only triggers when the component mounts or when the dependencies change.
  * And when the user navigates to a new page, the ApplicationLayout component doesn't unmount and remount.
  */
  useEffect(() => {
    verifyToken();
  }, [location.pathname]);

  function handleRegisterClick() {
    setAuthAction("register");
    setShowAuthModal(true);
    console.log("Registering...");
  }

  function handleLoginClick() {
    setAuthAction("login");
    setShowAuthModal(true);
    console.log("Logging in...");
  }

  function handleLogoutClick() {
    axios.post("/api/auth/logout")
      .then(response => {
        console.log(response.data);
        dispatch(unauthenticated());
      })
      .catch(error => {
        console.error(error);
      });

    console.log("Logging out...");
  }

  return (
    <div id="background" className="min-vh-100">
      <Container id="container" className="min-vh-100 d-flex flex-column">
        <div id="header">
          <div className="py-5 px-3 bg-light">
            <h1>Mike's Library App</h1>
            <p>Sort of...</p>
          </div>
          <Navbar className="justify-content-between bg-secondary">
            <Nav className="bg-secondary">
              <Nav.Link as={NavLink} to="/">Home</Nav.Link>
              <Nav.Link as={NavLink} to="/books">Books</Nav.Link>
              <Nav.Link as={NavLink} to="/authors">Authors</Nav.Link>
            </Nav>
            <Nav className="bg-secondary justify-content-end">
              {auth?.isAuthenticated ?
                <Nav.Link onClick={handleLogoutClick}>Log out</Nav.Link>
                :
                <>
                  <Nav.Link onClick={handleLoginClick}>Log in</Nav.Link>
                  <Nav.Link onClick={handleRegisterClick}>Register</Nav.Link>
                </>
              }
            </Nav>
          </Navbar>
        </div>

        <div id="body" className="px-2 py-3 mt-0 bg-light flex-grow-1">
          <Outlet />
        </div>

        <AuthModal show={showAuthModal} action={authAction} setShow={setShowAuthModal} />
      </Container>
    </div>
  );
}

export default ApplicationLayout;