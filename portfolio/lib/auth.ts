import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from './jwt';

/**
 * Middleware to verify JWT token from cookie or Authorization header
 * Priority: Cookie > Authorization header
 * Returns the decoded token if valid, otherwise returns null
 */
export async function authenticateRequest(request: NextRequest): Promise<{ email: string } | null> {
  // Try to get token from httpOnly cookie first (secure)
  const cookieToken = request.cookies.get('authToken')?.value;
  
  if (cookieToken) {
    const payload = await verifyToken(cookieToken);
    if (payload) {
      return { email: payload.email };
    }
  }

  // Fallback to Authorization header (for API clients)
  const authHeader = request.headers.get('Authorization');
  const headerToken = extractTokenFromHeader(authHeader);

  if (!headerToken) {
    return null;
  }

  const payload = await verifyToken(headerToken);
  if (!payload) {
    return null;
  }

  return { email: payload.email };
}

/**
 * Helper to return 401 Unauthorized response
 */
export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

/**
 * Helper to return 403 Forbidden response
 */
export function forbiddenResponse() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

