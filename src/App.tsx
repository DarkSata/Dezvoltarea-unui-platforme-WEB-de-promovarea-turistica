/* File: src/App.tsx */
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./app/layout/AppLayout";
import ProtectedRoute from "./app/router/ProtectedRoute";

import HomePage from "./pages/HomePage";
import DestinationsPage from "./pages/DestinationsPage";
import RoutesPage from "./pages/RoutesPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";

import Unauthorized401 from "./pages/errors/Unauthorized401";
import Forbidden403 from "./pages/errors/Forbidden403";
import NotFound404 from "./pages/errors/NotFound404";
import ServerError500 from "./pages/errors/ServerError500";

export default function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/routes" element={<RoutesPage />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/401" element={<Unauthorized401 />} />
                <Route path="/403" element={<Forbidden403 />} />
                <Route path="/500" element={<ServerError500 />} />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/404" element={<NotFound404 />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
        </Routes>
    );
}
