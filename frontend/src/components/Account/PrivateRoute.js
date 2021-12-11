import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../../firebase/Auth';

const PrivateRoute = () => {
  const { currentUser } = React.useContext(AuthContext); 
  
  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return !!currentUser ? <Outlet /> : <Navigate to="/login" />;
}
export default PrivateRoute;
