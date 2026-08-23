import axios from "axios";

// Base URL configured from VITE_BACKEND_API_URL env variable with fallback
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request Interceptor: Attach stored JWT token to Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Verify a login_token with the existing backend
 * GET /api/auth/verify-login-token?token=<token>
 */
export const verifyLoginToken = async (token) => {
  const endpoint = `${API_BASE_URL}/api/auth/verify-login-token?token=${token}`;
  console.log(`[API DEBUG] Firing request to backend endpoint: ${endpoint}`);

  try {
    const response = await apiClient.get("/api/auth/verify-login-token", {
      params: { token },
    });
    console.log("[API DEBUG] Token verification response received from backend:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "[API DEBUG] Token verification API call error:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Fetch authenticated user profile
 * GET /api/auth/me
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/api/auth/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw error;
  }
};
