import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Only enforce HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    const proto = request.headers.get('x-forwarded-proto');
    const host = request.headers.get('host');

    // If not HTTPS, redirect to HTTPS
    if (proto === 'http' && host) {
      const url = new URL(request.url);
      url.protocol = 'https:';
      return NextResponse.redirect(url, { status: 301 });
    }
  }

  // Continue to next middleware/handler
  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: ['/:path*'],
};
