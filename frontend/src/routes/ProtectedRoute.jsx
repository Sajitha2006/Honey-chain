import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to their own dashboard
    const redirect =
      user?.role === "beekeeper" ? "/beekeeper/dashboard" : "/customer/dashboard";
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default ProtectedRoute;