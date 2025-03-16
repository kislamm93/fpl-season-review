
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a random color hex code
 */
export function generateRandomColor(): string {
  // Create vibrant but not too light colors
  const hue = Math.floor(Math.random() * 360); // Random hue (0-359)
  const saturation = 75 + Math.floor(Math.random() * 25); // Random saturation (75-99)
  const lightness = 40 + Math.floor(Math.random() * 20); // Random lightness (40-59)
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
