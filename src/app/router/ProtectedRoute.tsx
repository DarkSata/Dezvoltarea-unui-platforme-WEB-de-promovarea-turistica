/* File: src/app/router/ProtectedRoute.tsx */
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";
import type { UserRole } from "../../types/auth";

type Props = {
    requiredRole?: UserRole;
    children: React.ReactNode;
};

export default function ProtectedRoute({ requiredRole, children }: Props) {
    const location = useLocation();
    const user = authService.getSession();

    if (!user) {
        return <Navigate to="/401" replace state={{ from: location.pathname }} />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/403" replace />;
    }

    return <>{children}</>;
}
