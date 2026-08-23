
/**
 * Environment configuration utility
 */

// Both dev and prod talk to OUR fpl-backend (not the raw FPL API):
//   dev  -> local uvicorn on :8000
//   prod -> Render URL injected at build time via VITE_API_BASE
export const API_URLS = {
  development: "http://127.0.0.1:8000",
  production: import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000",
};

export const getApiBaseUrl = (): string => {
  const isDevelopment = import.meta.env.DEV;
  return isDevelopment ? API_URLS.development : API_URLS.production;
};

export const getApiEndpoint = (endpoint: string): string => {
  // Our backend mounts routes without the /api prefix (unlike the raw FPL API),
  // so strip it in every environment now that prod targets our backend too.
  let formattedEndpoint = endpoint.startsWith('/api/')
    ? endpoint.replace('/api', '')
    : endpoint;

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
