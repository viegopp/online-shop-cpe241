import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginCustomer from "./pages/Customer/Login";
import SignUpCustomer from "./pages/Customer/SignUp";
import HomepageAdmin from "./pages/Admin/Homepage";
import LoginAdmin from "./pages/Admin/Login";
import DashboardPage from "./pages/Admin/Dashboard";
import StackManagementPage from "./pages/Admin/StockManagement";
import {
  ProductReviewLandingPage,
  ProductReviewDetailPage,
} from "./pages/Admin/ProductReviews";
import TrackOrderPage from "./pages/Admin/TrackOrders";
import ProductEditPage from "./pages/Admin/ProductEdit";
import CustomerManagementPage from "./pages/Admin/CustomerManagement";
import AdminManagementPage from "./pages/Admin/AdminManagement";
import AdminProfilePage from "./pages/Admin/AdminProfile";
import FlashSalesListPage from "./pages/Admin/FlashSalesList";
import FlashSalesAdd from "./pages/Admin/FlashSalesAdd";  
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./auth/AuthProvider";


const ROUTES = {
  CUSTOMER: [
    { path: "/customer/login", element: <LoginCustomer /> },
    { path: "/customer/signup", element: <SignUpCustomer /> },
    {
      path: "/customer/homepage",
      element: (
        <PrivateRoute requiredRole="customer">
          {/* Customer Dashboard */}
        </PrivateRoute>
      ),
    },
  ],
  ADMIN: [
    { path: "/admin/login", element: <LoginAdmin /> },
    {
      path: "/admin/homepage",
      element: (
        // <PrivateRoute requiredRole="admin">
          <HomepageAdmin />
        // </PrivateRoute>
      ),
    },
    {
      path: "/admin/dashboard",
      element: (
        // <PrivateRoute requiredRole="admin">
          <DashboardPage />
        // </PrivateRoute>
      ),
    },
    {
      path: "/admin/inventory/stock-management",
      element: (
        
        <PrivateRoute requiredRole="admin">
=======
        
        // <PrivateRoute requiredRole="admin">
>>>>>>> Stashed changes
          <StackManagementPage />
        // </PrivateRoute>
      ),
    },
    {
      path: "/admin/inventory/stock-management/:productId",
      element: (
        // <PrivateRoute requiredRole="admin">
          <ProductEditPage />
        // </PrivateRoute>
      ),
    },
    {
      path: "/admin/inventory/products-reviews",
      element: (
        // <PrivateRoute requiredRole="admin">
          <ProductReviewLandingPage />
        // </PrivateRoute>
      ),
    },
    {
      path: "/admin/inventory/products-reviews/:productId",
      element: (
        // <PrivateRoute requiredRole="admin">
          <ProductReviewDetailPage />
        // </PrivateRoute>
      ),
    },
    {
      path: "admin/orders/track",
      element: (
        // <PrivateRoute requiredRole="admin">
          <TrackOrderPage />
        // </PrivateRoute>
      ),
    },
    {
      path: "admin/user/customers",
      element: (
        // <PrivateRoute requiredRole="admin">
          <CustomerManagementPage />
        // </PrivateRoute>
      ),
    },
    {
      path: "admin/user/admins",
      element: (
        // <PrivateRoute requiredRole="admin">
          <AdminManagementPage />
        </PrivateRoute>
      ),
    },
    {
      path: "admin/flash-sales",
      element: (
          <FlashSalesListPage />
      ),
    },
    {
      path: "admin/flash-sales/add",
      element: (
          <FlashSalesAdd />
      ),
    },
    {
>>>>>>> Stashed changes
      path: "admin/user/admins/:adminId",
      element: (
        //<PrivateRoute requiredRole="admin">
          <AdminProfilePage />
        //</PrivateRoute>
      ),
    },
  ],
  REDIRECTS: [
    { path: "/", element: <Navigate to="/customer/homepage" replace /> },
    { path: "/admin/", element: <Navigate to="/admin/homepage" replace /> },
  ],
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Redirects */}
        {ROUTES.REDIRECTS.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* Customer Routes */}
        {ROUTES.CUSTOMER.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* Admin Routes */}
        {ROUTES.ADMIN.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
