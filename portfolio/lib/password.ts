import bcrypt from 'bcryptjs';

/**
 * Hash a password using bcryptjs
 * @param password - Plain text password to hash
 * @returns Promise<string> - Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password to compare against
 * @returns Promise<boolean> - True if passwords match
 */
export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a password hash for use in environment variables
 * Use this function to generate hashes for your admin password
 * Then set ADMIN_PASSWORD_HASH in .env
 */
export async function generatePasswordHash(password: string): Promise<string> {
  return hashPassword(password);
}
