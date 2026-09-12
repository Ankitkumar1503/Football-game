import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Production Railway API URL with fallback
const API_BASE_URL =
  process.env.EXPO_PUBLIC_BACKEND_API_URL ||
  'https://footballbackend-production-9919.up.railway.app';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach stored JWT token to Authorization header
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Error reading authToken for request:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Register a new player with the backend API
 * POST /api/registrations
 */
export const registerPlayer = async (registrationData) => {
  const firstName = (
    registrationData.fullName ||
    registrationData.playerName ||
    registrationData.firstName ||
    'Player'
  ).trim();

  // If email not provided, generate fallback so backend validation succeeds
  const cleanName = firstName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'player';
  const email =
    registrationData.email && registrationData.email.trim().length > 0
      ? registrationData.email.trim()
      : `${cleanName}${Date.now().toString().slice(-4)}@touches.app`;

  const payload = {
    firstName,
    lastName: registrationData.lastName || '',
    email,
    country: registrationData.country || 'United States',
    footPreference: (
      registrationData.activeFooter ||
      registrationData.footPreference ||
      'RIGHT'
    ).toLowerCase(),
    age: registrationData.age ? String(registrationData.age) : undefined,
    club: registrationData.club || registrationData.team || undefined,
    position: registrationData.position || undefined,
    phone: registrationData.cellPhone || registrationData.phone || undefined,
  };

  try {
    const response = await apiClient.post('/api/registrations', payload);
    return response.data;
  } catch (error) {
    console.error(
      'Registration API error:',
      error?.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Verify a login_token with backend
 * GET /api/auth/verify-login-token?token=<token>
 */
export const verifyLoginToken = async (token) => {
  try {
    const response = await apiClient.get('/api/auth/verify-login-token', {
      params: { token },
    });
    return response.data;
  } catch (error) {
    console.error(
      '[API DEBUG] Token verification API call error:',
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
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user profile:', error);
    throw error;
  }
};
