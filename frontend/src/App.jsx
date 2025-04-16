import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LogIn";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./auth/AuthProvider";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {/* Replace with your Dashboard component */}
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
