import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../services/apiClient";

/**
 * useHealthCheck
 *
 * Calls GET /api/health on mount.
 * If the backend is unreachable (network error), redirects to /500.
 */
export function useHealthCheck(): void {
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/api/health").catch(() => {
      navigate("/500", { replace: true });
    });
  }, [navigate]);
}
