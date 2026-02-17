import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Navbar from "./components/Navbar";
import FloatingCartFlag from "./components/FloatingCartFlag";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";

import BakerDashboard from "./pages/baker/BakerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import Browse from "./pages/Browse";

export default function App() {
  return (
    <GoogleOAuthProvider clientId="415521222634-5d9bqmjnop5uhenmefgq1bash056oamp.apps.googleusercontent.com">
      <BrowserRouter>
        <Navbar />
  <FloatingCartFlag />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Baker dashboard */}
          <Route
            path="/baker/dashboard"
            element={
              <ProtectedRoute role="baker">
                <BakerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/browse" element={<Browse />} />


        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
