import React, { useContext } from 'react';
import './accountPage.css';
import { Navigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doPasswordReset } from '../../firebase/FirebaseFunctions';
import { AuthContext } from '../../firebase/Auth';
import { Form, Button, Container } from 'react-bootstrap';
import SocialSignIn from './SocialSignIn';

function Login() {
  const { currentUser } = useContext(AuthContext);
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
    let email = document.getElementById('email').value;
    if (email) {
      doPasswordReset(email);
      alert('Password reset email was sent');
    } else {
      alert('Please enter an email address below before you click the forgot password link.');
    }
  };

  if (currentUser) {
    return <Navigate to='/' />
  }

  return (
    <Container>
    <div className="form-body">
      <h2>Login Page</h2>
      <Form onSubmit={handleSignIn}>
        <Form.Group>
          <br />
          <div className='form-group'>
            <Form.Label>Email:
              <Form.Control
                className='form-control'
                type='email'
                name='email'
                id = 'email'
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
                name='password'
                type='password'
                placeholder='Password'
                required>
              </Form.Control>
            </Form.Label>
          </div>
          <br />
          <Button className="btn"
            type='submit'>
            Login
          </Button>

          <Button
            className='btn-forgot-pswd' onClick={passwordReset}>
            Forgot Password
          </Button>
        </Form.Group>

      </Form>
      <br />
      <SocialSignIn />
    </div>
    </Container>
  );
}

export default Login;