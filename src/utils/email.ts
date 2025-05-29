/**
 * Email utility functions for validation and normalization
 */

/**
 * Normalizes email by removing + aliases in production environment
 * In development, returns email as-is for testing purposes
 * 
 * Examples:
 * - "test+one@gmail.com" -> "test@gmail.com" (production)
 * - "user+signup@example.com" -> "user@example.com" (production)
 * - "test+one@gmail.com" -> "test+one@gmail.com" (development)
 * 
 * @param email - The email address to normalize
 * @returns Normalized email address
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return email;
  }

  // Trim whitespace and convert to lowercase
  const trimmedEmail = email.trim().toLowerCase();

  // In development environment, allow + aliases for testing
  if (process.env.NODE_ENV === 'development') {
    return trimmedEmail;
  }

  // In production, remove + aliases
  const [localPart, domain] = trimmedEmail.split('@');
  
  if (!localPart || !domain) {
    return trimmedEmail; // Return as-is if invalid format
  }

  // Remove everything after + in the local part
  const normalizedLocalPart = localPart.split('+')[0];
  
  return `${normalizedLocalPart}@${domain}`;
}

/**
 * Validates email format and checks for + aliases in production
 * 
 * @param email - The email address to validate
 * @returns Object with validation result and message
 */
export function validateEmail(email: string): { isValid: boolean; message?: string } {
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: 'Email is required' };
  }

  const trimmedEmail = email.trim();

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, message: 'Invalid email format' };
  }

  // In production, check for + aliases
  if (process.env.NODE_ENV === 'production' && trimmedEmail.includes('+')) {
    return { 
      isValid: false, 
      message: 'Email aliases with + are not allowed. Please use your main email address.' 
    };
  }

  return { isValid: true };
}
