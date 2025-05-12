import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null; // or loading spinner
  }

  // Determine if this is an admin or customer route
  const isAdminRoute = location.pathname.includes("/admin/");
  console.log(`isAdminRoute: ${isAdminRoute}`);

  // If user is not authenticated, redirect to appropriate login page
  if (!user) {
    console.log("User not authenticated");
    return <Navigate to={isAdminRoute ? "/admin/login" : "/customer/login"} />;
  }

  // If requiredRole is provided, check if user has the required role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect admin to admin routes and customers to customer routes
    return (
      <Navigate
        to={
          ["Super Admin", "Staff Admin"].includes(user.role)
            ? "/admin/homepage"
            : "/customer/homepage"
        }
      />
    );
  }

  return children;
};

export default PrivateRoute;
