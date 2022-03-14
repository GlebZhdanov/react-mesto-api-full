import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  return (
    props.loginVerification ? props.children : <Navigate to="/sign-in" />
  );
}

export default ProtectedRoute;