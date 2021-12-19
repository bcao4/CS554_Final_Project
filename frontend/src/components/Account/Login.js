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
import { Button, TextField, Typography } from "@mui/material";

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
      <Typography
        variant="h1"
        style={{ fontSize: "2rem", marginBottom: "14px" }}
      >
        Login
      </Typography>
      <form onSubmit={handleSignIn}>
        <div>
          <div className="form-input">
            <label htmlFor="email">Email:</label>
            <TextField
              type="email"
              name="email"
              id="email"
              placeholder="Enter Email"
              required
            ></TextField>
          </div>
          <div className="form-input">
            <label htmlFor="password">Password:</label>
            <TextField
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
            ></TextField>
          </div>
          <Button
            type="submit"
            variant="contained"
            style={{ marginRight: "8px" }}
            color="primary"
          >
            Login
          </Button>
          <Button
            onClick={passwordReset}
            variant="contained"
            color="secondary"
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            Forgot Password
          </Button>
        </div>
      </form>
      <SocialSignIn />
    </div>
  );
};

export default Login;
