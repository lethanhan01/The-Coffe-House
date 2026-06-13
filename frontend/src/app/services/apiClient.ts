export const API_URL = import.meta.env.VITE_API_BASE_URL as string;

export const getAuthToken = (): string | null =>
  localStorage.getItem('token');

export const getHeaders = (contentType = true): HeadersInit => {
  const headers: HeadersInit = {};
  if (contentType) headers['Content-Type'] = 'application/json';
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};
