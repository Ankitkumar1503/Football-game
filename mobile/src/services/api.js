import AsyncStorage from '@react-native-async-storage/async-storage';

// Production Railway API URL with fallback
const API_BASE_URL =
  process.env.EXPO_PUBLIC_BACKEND_API_URL ||
  'https://footballbackend-production-9919.up.railway.app';

console.log('[API CONFIG] Active API_BASE_URL:', API_BASE_URL);

/**
 * Robust fetch wrapper with timeout and auth header attachment
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL.replace(/\/+$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const token = await AsyncStorage.getItem('authToken').catch(() => null);
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), options.timeout || 15000) : null;

  try {
    console.log(`[API] ${options.method || 'GET'} -> ${url}`);
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller?.signal,
    });

    if (timeoutId) clearTimeout(timeoutId);

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    console.error(`[API ERROR] ${options.method || 'GET'} ${url}:`, error?.message || error);
    throw error;
  }
}

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

  return await request('/api/registrations', {
    method: 'POST',
    body: JSON.stringify(payload),
    timeout: 15000,
  });
};

/**
 * Verify a login_token with backend
 * GET /api/auth/verify-login-token?token=<token>
 */
export const verifyLoginToken = async (token) => {
  return await request(`/api/auth/verify-login-token?token=${encodeURIComponent(token)}`, {
    method: 'GET',
    timeout: 12000,
  });
};

/**
 * Fetch authenticated user profile
 * GET /api/auth/me
 */
export const getCurrentUser = async () => {
  return await request('/api/auth/me', {
    method: 'GET',
    timeout: 12000,
  });
};

