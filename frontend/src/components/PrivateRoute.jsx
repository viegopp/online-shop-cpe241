import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  console.log("PrivateRoute user:", user);

  if (loading) {
    return null; // or loading spinner
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
