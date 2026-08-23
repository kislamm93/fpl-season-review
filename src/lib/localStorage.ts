
/**
 * Utility functions for working with localStorage
 */

// Save a value to localStorage
export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving to localStorage (key: ${key}):`, error);
  }
};

// Get a value from localStorage
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error);
    return defaultValue;
  }
};

// Remove a value from localStorage
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error);
  }
};

// Storage keys
export const STORAGE_KEYS = {
  MANAGER_ID: 'fpl_manager_id',
  ADMIN_KEY: 'fpl_admin_key',
};
