/**
 * Centralized error handling utilities
 */

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Handle authentication errors consistently across the app
 */
export function handleAuthError(status: number, router: any): boolean {
  if (status === 401) {
    alert('Session expired. Please login again.');
    router.push('/admin');
    return true;
  }
  return false;
}

/**
 * Format error messages for display to users
 */
export function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}

/**
 * Log errors with appropriate level (dev vs prod)
 */
export function logError(
  component: string,
  error: unknown,
  context?: Record<string, any>
): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${component}]`, error, context);
  } else {
    // In production, could send to error tracking service (e.g., Sentry)
    console.error(`[${component}]`, error?.toString?.());
  }
}

/**
 * Safely handle API responses with error checking
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    throw new AppError('Unauthorized', 401);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new AppError(
      errorData.error || `Request failed with status ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json();
}
