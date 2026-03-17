import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'vc5cRT5EzhtfZJ/NTkPkYj0MrFPmMBpBUqSthUOgwDY=');
const JWT_EXPIRY = 86400; // 24 hours in seconds

export interface JWTPayload {
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token
 */
export async function generateToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return {
      email: verified.payload.email as string,
      iat: verified.payload.iat,
      exp: verified.payload.exp,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  
  return null;
}
