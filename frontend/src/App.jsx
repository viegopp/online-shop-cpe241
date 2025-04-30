import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginCustomer from "./pages/Customer/Login";
import SignUpCustomer from "./pages/Customer/SignUp";
import HomepageAdmin from "./pages/Admin/Homepage";
import LoginAdmin from "./pages/Admin/Login";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./auth/AuthProvider";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Customer */}
        <Route
          path="/"
          element={<Navigate to="/customer/homepage" replace />}
        />
        <Route path="/customer/login" element={<LoginCustomer />} />
        <Route path="/customer/signup" element={<SignUpCustomer />} />
        <Route
          path="/customer/homepage"
          element={
            <PrivateRoute requiredRole="customer">
              {/* Replace with your Dashboard component */}
            </PrivateRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/"
          element={<Navigate to="/admin/homepage" replace />}
        />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route
          path="/admin/homepage"
          element={
            <PrivateRoute requiredRole="admin">
              <HomepageAdmin />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
