import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { hashPassword, comparePasswords } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const adminPasswordPlain = process.env.ADMIN_PASSWORD;

    if (!adminEmail || (!adminPasswordHash && !adminPasswordPlain)) {
      console.error('Admin credentials not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Check email matches
    if (email !== adminEmail) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare password (supports both hashed and plaintext for development)
    let isPasswordValid = false;

    if (adminPasswordHash) {
      // Use hashed password (recommended for production)
      isPasswordValid = await comparePasswords(password, adminPasswordHash);
    } else if (adminPasswordPlain) {
      // Fall back to plaintext comparison (development only - for migration)
      isPasswordValid = password === adminPasswordPlain;
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await generateToken(email);

    // Create response with httpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
    });

    // Set httpOnly, secure cookie
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
