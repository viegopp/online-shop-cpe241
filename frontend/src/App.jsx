import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./auth/AuthProvider";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/inventory/stock" element={<div>Stock Management Page</div>} />
        <Route path="/inventory/products" element={<div>Products & Reviews Page</div>} />
        <Route path="/orders/track" element={<div>Track Orders Page</div>} />
        <Route path="/users/customers" element={<div>Customers Page</div>} />
        <Route path="/users/admins" element={<div>Admins Page</div>} />
        <Route path="/flash-sales" element={<div>Flash Sales Page</div>} />
        <Route path="/report" element={<div>Report Page</div>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
