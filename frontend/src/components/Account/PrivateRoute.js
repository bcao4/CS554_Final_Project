<<<<<<< HEAD
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
=======
import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "../../firebase/Auth";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        {...rest}
        render={(routeProps) =>
          !!currentUser ? (
            <RouteComponent {...routeProps} />
          ) : (
            <Navigate to={"login"} />
          )
        }
      />
    </Routes>
  );
};

export default PrivateRoute;
>>>>>>> bfeed5c17e95281e4ec80a3a31fca27917e6fd6d
