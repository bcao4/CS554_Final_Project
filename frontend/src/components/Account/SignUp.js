import { useContext, useEffect, useState } from "react";
import "./accountPage.css";
import { Navigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../../firebase/FirebaseFunctions";
import { AuthContext } from "../../firebase/Auth";
import SocialSignIn from "./SocialSignIn";
import axios from "axios";
import useDocumentTitle from "../../shared/useDocumentTitle";
import { API_URL } from "../../api";
import { Typography, Button, TextField } from "@mui/material";

const SignUp = () => {
  const { currentUser } = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState("");

  const [usernameData, setUsernameData] = useState();

  useDocumentTitle("Sign Up - CryptoTracker");

  //added new user
  useEffect(() => {
    const userData = async () => {
      try {
        if (currentUser) {
          let token = await currentUser.getIdToken();
          let dName;
          if (!currentUser.displayName) {
            dName = usernameData;
          } else {
            dName = currentUser.displayName;
          }

          await axios.post(
            `${API_URL}/users/addUser`, //removed https for API call
            { email: currentUser.email, displayname: dName },
            {
              headers: {
                accept: "application/json",
                "Accept-Language": "en-US,en;q=0.8",
                "Content-Type": "application/json",
                authtoken: token,
              },
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    userData();
  }, [currentUser, usernameData]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { displayName, email, passwordOne, passwordTwo } = e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch("Passwords do not match");
      return false;
    }
    try {
      //set userName
      setUsernameData(displayName.value);
      //
      await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName.value
      );
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <div className="form-body">
        <Typography
          variant="h1"
          style={{ fontSize: "2rem", marginBottom: "14px" }}
        >
          Sign Up
        </Typography>
        {pwMatch && <h4 className="error">{pwMatch}</h4>}
        <form onSubmit={handleSignUp}>
          <div>
            <div className="form-input">
              <label htmlFor="displayName">Name:</label>
              <TextField
                type="text"
                id="displayName"
                name="displayName"
                placeholder="Enter Name"
                required
              ></TextField>
            </div>
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
              <label htmlFor="passwordOne">Password:</label>
              <TextField
                id="passwordOne"
                name="passwordOne"
                type="password"
                placeholder="Password"
                required
              ></TextField>
            </div>
            <div className="form-input">
              <label htmlFor="passwordTwo">Confirm Password:</label>
              <TextField
                name="passwordTwo"
                id="passwordTwo"
                type="password"
                placeholder="Confirm password"
                required
              ></TextField>
            </div>
            <Button
              variant="contained"
              name="submitButton"
              type="submit"
              style={{ marginBottom: "14px" }}
            >
              Sign Up
            </Button>
          </div>
        </form>
        <SocialSignIn />
      </div>
    </div>
  );
};

export default SignUp;
