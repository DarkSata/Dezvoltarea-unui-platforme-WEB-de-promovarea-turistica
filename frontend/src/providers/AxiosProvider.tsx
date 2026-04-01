import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { AxiosInstance } from "axios";
import { axiosInstance } from "../services/apiClient";

// Context — exposes the configured Axios instance to the component tree
const AxiosContext = createContext<AxiosInstance>(axiosInstance);

/** Hook to access the shared Axios instance from any component */
export function useAxios(): AxiosInstance {
  return useContext(AxiosContext);
}

interface AxiosProviderProps {
  children: ReactNode;
}

/**
 * AxiosProvider
 *
 * Registers response interceptors on the shared axios instance:
 *   - Network error (backend down) → redirect to /500
 *   - 401 Unauthorized             → redirect to /login
 *   - 403 Forbidden                → redirect to /403
 *
 * Interceptors are removed when the component unmounts.
 */
export function AxiosProvider({ children }: AxiosProviderProps) {
  const navigate = useNavigate();
  const interceptorId = useRef<number | null>(null);

  useEffect(() => {
    interceptorId.current = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response) {
          // No response at all — backend is unreachable
          navigate("/500", { replace: true });
        } else if (error.response.status === 401) {
          navigate("/login", { replace: true });
        } else if (error.response.status === 403) {
          navigate("/403", { replace: true });
        }
        return Promise.reject(error as Error);
      },
    );

    return () => {
      if (interceptorId.current !== null) {
        axiosInstance.interceptors.response.eject(interceptorId.current);
      }
    };
  }, [navigate]);

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {children}
    </AxiosContext.Provider>
  );
}
