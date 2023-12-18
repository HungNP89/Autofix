import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from './AuthContext';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth } = useContext(authContext);
  const { loading, token } = auth;

  if (loading) {
    return null;
  }

  if (!token) {
    return <Navigate to={requiredRole === "admin" ? "/admin" : "/login"} />;
  }

  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const userRole = decodedToken && decodedToken.role;
  // console.log(userRole);
  // console.log(requiredRole)

  if (requiredRole === "admin" && userRole !== "admin") {
    return <Navigate to="/panel" />;
  }

  if (requiredRole === "user" && userRole !== "user") {
    return <Navigate to="/main" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
