import { authenticated, unauthenticated } from "../slices/authSlice.js";
import store from "../store.js";
import axios from "axios";


const verifyToken = () => {
  console.log('Verifying token...');

  /*
  * Our jwt token is stored as a cookie in the browser. So we don't need to send it with the request.
  * Every request we make to an address will contain all cookies that are set for that address.
  *
  * So if when we have a jwt cookie set, the server will verify it and send back the user object.j
  * If the token is invalid or missing because the cookie is not set, the server will send back a 401 status code.
  */
  axios.get("/api/auth/verifyToken")
    .then(response => {
      store.dispatch(authenticated(response.data));
    })
    .catch(error => {
      console.log(`Token verification failed.`);
      console.log(error.response.data);

      /*
      * useDispatch is a react hook, meaning that it can only be used in a functional component.
      * Since this is a plain JavaScript file, we can't use useDispatch here.
      *
      * Instead, we will use the store object that we created in store.js.
      * We will use the dispatch method of the store object to dispatch the unauthenticated action.
      */
      store.dispatch(unauthenticated());
    });
}

export { verifyToken };