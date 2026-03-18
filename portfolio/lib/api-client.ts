/**
 * Authenticated fetch wrapper that automatically includes httpOnly cookies
 * Replaces the need for manual Authorization header
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(url, {
    ...options,
    credentials: 'include', // Include httpOnly cookies
  });
}

/**
 * Handle common authentication errors
 * Returns true if the user should be redirected to login
 */
export function checkAuthError(status: number): boolean {
  return status === 401 || status === 403;
}
