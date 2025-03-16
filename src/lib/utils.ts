
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a consistent color based on a string input
 * This ensures the same name always gets the same color
 */
export function generateRandomColor(seed?: string): string {
  if (seed) {
    // Generate a deterministic color based on the string
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Create HSL color with good saturation and lightness
    const h = Math.abs(hash % 360);
    const s = 75 + (hash % 15); // 75-90%
    const l = 45 + (hash % 10); // 45-55%
    
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  
  // Fallback to a random color if no seed is provided
  const hue = Math.floor(Math.random() * 360); // Random hue (0-359)
  const saturation = 75 + Math.floor(Math.random() * 25); // Random saturation (75-99)
  const lightness = 40 + Math.floor(Math.random() * 20); // Random lightness (40-59)
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
