import React, { useContext, useEffect, useState } from 'react';
import './accountPage.css';
import { AuthContext } from '../../firebase/Auth';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import SignOutButton from './SignOut';
import { Container } from 'react-bootstrap';

function Account(props) {
const { currentUser } = useContext(AuthContext);
const [userName, setUserName] = useState(undefined);

  useEffect(() => {
    console.log("render");
    async function fetchData() {
      try {
        let token = await currentUser.getIdToken();
        let config = {
          method: "get",
          url: "http://localhost:4000/users/" + (currentUser.email),
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": "application/json",
            authtoken: token,
          },
        };
        const { data } = await axios(config);
        setUserName(data.displayName);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [
    currentUser.email,
    userName,
    currentUser
  ]);

  const changePassword = () => {
    if (currentUser.providerData[0].providerId === 'password') {
      return (
        <button className="btn-reset-pswd">
          <NavLink exact to="/changepassword" activeclassname="active">
            Reset password
          </NavLink>
        </button>
      );
    } else {
      return null;
    }
  };

  return (
    <>
    <Container>
      <div className="form-body">
        <h2>Account Details</h2>
        <br />
        <div>
          <b>Name: </b>
          {userName}
          <br />
          <br />
          <b>Email: </b>
          {currentUser.email}
        </div>
        <br />
        {changePassword()}
      <SignOutButton />
      </div>
      </Container>
    </>
  );
}

export default Account;
