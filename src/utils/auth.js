export const AUTH_TOKEN_KEY = "erp_auth_token";
export const AUTH_USER_KEY = "erp_auth_user";

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
export const getAuthUser = () => {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}; 

export const setAuthUser = (user) => {
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};
