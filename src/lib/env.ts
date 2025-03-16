
/**
 * Environment configuration utility
 */

export const API_URLS = {
  development: "http://127.0.0.1:8000",
  production: "https://fantasy.premierleague.com/api",
};

export const getApiBaseUrl = (): string => {
  const isDevelopment = import.meta.env.DEV;
  return isDevelopment ? API_URLS.development : API_URLS.production;
};

export const getApiEndpoint = (endpoint: string): string => {
  return `${getApiBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};
