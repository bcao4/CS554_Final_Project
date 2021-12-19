import { useContext } from "react";
import "./accountPage.css";
import { Navigate } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from "../../firebase/FirebaseFunctions";
import useDocumentTitle from "../../shared/useDocumentTitle";
import { AuthContext } from "../../firebase/Auth";
import SocialSignIn from "./SocialSignIn";
import { Typography } from "@mui/material";

const Login = () => {
  const { currentUser } = useContext(AuthContext);

  useDocumentTitle("Login - CryptoTracker");

  const handleSignIn = async (e) => {
    e.preventDefault();
    let { email, password } = e.target.elements;
    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      alert(error);
    }
  };

  const passwordReset = (e) => {
    e.preventDefault();
    let email = document.getElementById("email").value;
    if (email) {
      doPasswordReset(email);
      alert("Password reset email was sent");
    } else {
      alert(
        "Please enter an email address below before you click the forgot password link."
      );
    }
  };

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="form-body">
      <Typography variant="h1" style={{ fontSize: "2rem" }}>
        Login
      </Typography>
      <form onSubmit={handleSignIn}>
        <div>
          <br />
          <div className="form-group">
            <label>
              Email:
              <input
                className="form-control"
                type="email"
                name="email"
                id="email"
                placeholder="Enter Email"
                required
              ></input>
            </label>
          </div>
          <br />
          <div className="form-group">
            <label>
              Password:
              <input
                className="form-control"
                name="password"
                type="password"
                placeholder="Password"
                required
              ></input>
            </label>
          </div>
          <br />
          <button className="btn" type="submit">
            Login
          </button>
          <button className="btn-forgot-pswd" onClick={passwordReset}>
            Forgot Password
          </button>
        </div>
      </form>
      <br />
      <SocialSignIn />
    </div>
  );
};

export default Login;
