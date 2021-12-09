import React, { useContext, useState } from 'react';
import { AuthContext } from '../../firebase/Auth';
import { doChangePassword } from '../../firebase/FirebaseFunctions';
import { Form, Button, Container } from 'react-bootstrap';
import './accountPage.css';

function ChangePassword() {
    const { currentUser } = useContext(AuthContext);
    const [pwMatch, setPwMatch] = useState('');

    const submitForm = async (e) => {
        const { currentPassword, newPasswordOne, newPasswordTwo } = e.target.elements;
        if (newPasswordOne.value !== newPasswordTwo.value) {
            setPwMatch('New password do not match, please try again');
            return false;
        }

        try {
            await doChangePassword(
                currentUser.email,
                currentPassword.value,
                newPasswordOne.value
            );
            alert('Password has been changed successfully, you will be logged out');
        } catch (error) {
            alert(error);
        }
    };

    if (currentUser.providerData[0].providerId === 'password') {
        return (
            <Container>
            <div className="form-body">
                <h2>Reset Password</h2>
                {pwMatch && <h4 className='error'>{pwMatch}</h4>}
                <Form onSubmit={submitForm}>
                    <Form.Group>
                        <div className='form-group'>
                            <Form.Label>Current Password:
                                <Form.Control
                                    className='form-control'
                                    id='currentPassword'
                                    name='currentPassword'
                                    type='password'
                                    placeholder='Current Password'
                                    required>
                                </Form.Control>
                            </Form.Label>
                        </div>
                        <br />
                        <div className='form-group'>
                            <Form.Label>New Password:
                                <Form.Control
                                    className='form-control'
                                    id='newPasswordOne'
                                    name='newPasswordOne'
                                    type='password'
                                    placeholder='New Password'
                                    required>
                                </Form.Control>
                            </Form.Label>
                        </div>
                        <br />
                        <div className='form-group'>
                            <Form.Label>Confirm New Password:
                                <Form.Control
                                    className='form-control'
                                    id='newPasswordTwo'
                                    name='newPasswordTwo'
                                    type='password'
                                    placeholder='Confirm New Password'
                                    required>
                                </Form.Control>
                            </Form.Label>
                        </div>
                        <br />
                        <Button className="btn"
                            type='submit'>
                            Change Password
                        </Button>
                    </Form.Group>
                </Form>
            </div>
            </Container>
        );
    } else{
        return(
            <div>
                <h4>You are signed in using a Social Media Provider, You cannot change your password.</h4>
            </div>
        );
    }

}

export default ChangePassword;