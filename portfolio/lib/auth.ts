import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from './jwt';

/**
 * Middleware to verify JWT token from Authorization header
 * Returns the decoded token if valid, otherwise returns null
 */
export async function authenticateRequest(request: NextRequest): Promise<{ email: string } | null> {
  const authHeader = request.headers.get('Authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
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
