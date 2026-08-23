import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" state={{ message: "Please login first" }} />;
  } // → ?
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" state={{ message: "Access Denied" }} />;
  } // → ?

  return <Outlet />; // → ?
}
