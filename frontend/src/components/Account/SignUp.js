import React, { useContext, useEffect, useState } from 'react';
import './accountPage.css';
import { Navigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../../firebase/FirebaseFunctions';
import { AuthContext } from '../../firebase/Auth';
import { Form, Button, Container } from 'react-bootstrap';
import SocialSignIn from './SocialSignIn';
import axios from 'axios';

function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState('');

  const [usernameData, setUsernameData] = useState();

  //added new user
  useEffect(() => {
    const userData = async () => {
      try {
        if (currentUser) {
          addUser();
        }
      } catch (error) {
        console.log(error);
      }
    };
    userData();
  }, [currentUser]);

  const hadleSignUp = async (e) => {
    e.preventDefault();
    const { displayName, email, passwordOne, passwordTwo } = e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch('Passwords do not match');
      return false;
    }
    try {
      //set userName
      setUsernameData(displayName.value);
      //
      await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName
      );
    } catch (error) {
      alert(error);
    }
  }

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
      "http://localhost:4000/users/addUser",
      { email: currentUser.email, displayname: dName },
      {
        headers: {
          accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": "application/json",
          authtoken: token
        }
      }
    )
  }

  if (currentUser) {
    return <Navigate to='/' />
  }

  return (
    <Container>
    <div className="form-body">
      <h2>Sign Up</h2>
      {pwMatch && <h4 className='error'>{pwMatch}</h4>}
      <Form onSubmit={hadleSignUp}>
        <Form.Group>
          <div className='form-group'>
            <Form.Label>Name:
              <Form.Control
                className='form-control'
                type='text'
                name='displayName'
                placeholder='Enter Name'
                required>
              </Form.Control>
            </Form.Label>
          </div>
          <br />
          <div className='form-group'>
            <Form.Label>Email:
              <Form.Control
                className='form-control'
                type='email'
                name='email'
                placeholder='Enter Email'
                required>
              </Form.Control>
            </Form.Label>
          </div>
          <br />
          <div className='form-group'>
            <Form.Label>Password:
              <Form.Control
                className='form-control'
                id='passwordOne'
                name='passwordOne'
                type='password'
                placeholder='Password'
                required>
              </Form.Control>
            </Form.Label>
          </div>
          <br />
          <div className='form-group'>
            <Form.Label>Confirm Password:
              <Form.Control
                className='form-control'
                name='passwordTwo'
                type='password'
                placeholder='Confirm password'
                required>
              </Form.Control>
            </Form.Label>
          </div>
          <br />
          <Button
            id='submitButton'
            name='submitButton'
            type='submit'>
            Sign Up
          </Button>
        </Form.Group>
      </Form>
      <br />
      <SocialSignIn />
    </div>
    </Container>
  );
}

export default SignUp;