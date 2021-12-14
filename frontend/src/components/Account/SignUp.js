import { useContext, useEffect, useState } from "react";
import "./accountPage.css";
import { Navigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../../firebase/FirebaseFunctions";
import { AuthContext } from "../../firebase/Auth";
import SocialSignIn from "./SocialSignIn";
import axios from "axios";
import useDocumentTitle from "../../shared/useDocumentTitle";
import { API_URL } from "../../api";

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
          await addUser();
        }
      } catch (error) {
        console.log(error);
      }
    };
    userData();
  }, [currentUser]);

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

  //add data to database
  const addUser = async () => {
    let token = await currentUser.getIdToken();
    let dName;
    if (!currentUser.displayName) {
      dName = usernameData;
    } else {
      dName = currentUser.displayName;
    }

    return await axios.post(
      `http://${API_URL}/users/addUser`,
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
  };

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <div className="form-body">
        <h2>Sign Up</h2>
        {pwMatch && <h4 className="error">{pwMatch}</h4>}
        <form onSubmit={handleSignUp}>
          <div>
            <div className="form-group">
              <label>
                Name:
                <input
                  className="form-control"
                  type="text"
                  name="displayName"
                  placeholder="Enter Name"
                  required
                ></input>
              </label>
            </div>
            <br />
            <div className="form-group">
              <label>
                Email:
                <input
                  className="form-control"
                  type="email"
                  name="email"
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
                  id="passwordOne"
                  name="passwordOne"
                  type="password"
                  placeholder="Password"
                  required
                ></input>
              </label>
            </div>
            <br />
            <div className="form-group">
              <label>
                Confirm Password:
                <input
                  className="form-control"
                  name="passwordTwo"
                  type="password"
                  placeholder="Confirm password"
                  required
                ></input>
              </label>
            </div>
            <br />
            <button id="submitButton" name="submitButton" type="submit">
              Sign Up
            </button>
          </div>
        </form>
        <br />
        <SocialSignIn />
      </div>
    </div>
  );
};

export default SignUp;
