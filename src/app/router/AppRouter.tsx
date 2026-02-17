import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../../pages/HomePage";
import DestinationsPage from "../../pages/DestinationsPage";
import RoutesPage from "../../pages/RoutesPage";
import AdminPage from "../../pages/AdminPage";
import LoginPage from "../../pages/LoginPage";
import Unauthorized401 from "../../errors/Unauthorized401";
import Forbidden403 from "../../errors/Forbidden403";
import NotFound404 from "../../errors/NotFound404";
import ServerError500 from "../../errors/ServerError500";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="destinations" element={<DestinationsPage />} />
        <Route path="routes" element={<RoutesPage />} />
        <Route path="login" element={<LoginPage />} />

        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="admin" element={<AdminPage />} />
        </Route>

        <Route path="401" element={<Unauthorized401 />} />
        <Route path="403" element={<Forbidden403 />} />
        <Route path="404" element={<NotFound404 />} />
        <Route path="500" element={<ServerError500 />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
