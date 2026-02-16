import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";
import type { Role } from "../../types/auth";

type ProtectedRouteProps = {
  roles?: Role[];
};

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const location = useLocation();
  const session = authService.getSession();

  if (!session) {
    return <Navigate to="/401" replace state={{ from: location.pathname }} />;
  }

  if (roles && roles.length > 0 && !roles.includes(session.role)) {
    return <Navigate to="/403" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
