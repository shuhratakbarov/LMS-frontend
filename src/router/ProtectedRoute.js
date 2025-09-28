import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isAuthenticated, requiredRole, user }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.roleName !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;