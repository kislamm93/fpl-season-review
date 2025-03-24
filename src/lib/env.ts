
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
  // Remove the /api prefix if it's included in the endpoint for development environment
  const isDevelopment = import.meta.env.DEV;
  let formattedEndpoint = endpoint;
  
  if (isDevelopment && endpoint.startsWith('/api/')) {
    formattedEndpoint = endpoint.replace('/api', '');
  }
  
  return `${getApiBaseUrl()}${formattedEndpoint.startsWith('/') ? formattedEndpoint : `/${formattedEndpoint}`}`;
};

/**
 * Check if we're in a test environment where we can make direct API calls
 * This is just a simple check that can be enhanced
 */
export const canMakeDirectApiCalls = (): boolean => {
  try {
    // Check if we're in Node.js environment (for testing)
    return typeof window === 'undefined';
  } catch (e) {
    return false;
  }
};
