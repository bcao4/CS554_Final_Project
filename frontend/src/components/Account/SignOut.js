import React from 'react';
import { doSignOut } from '../../firebase/FirebaseFunctions';
import '../../App.css';
import { Button } from 'react-bootstrap';

const SignOutButton = () => {
  return (
      <Button className="btn-signout" type='button' onClick={doSignOut}>
      Sign Out
    </Button>
  );
}

export default SignOutButton;