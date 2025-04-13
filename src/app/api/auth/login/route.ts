import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

// This is a mock database for demonstration
// In a real app, you would use a database to store and verify credentials
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'Admin123', // In a real app, this would be hashed
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'User123', // In a real app, this would be hashed
    name: 'Regular User',
    role: 'user',
  },
];

// Simple login validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: result.error.errors },
        { status: 400 }
      );
    }
    
    const { email, password } = result.data;
    
    // Find user with matching credentials
    const user = MOCK_USERS.find(
      (user) => user.email === email && user.password === password
    );
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // In a real app, you would create a JWT with proper expiration
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    
    // Create a response
    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
    
    // Set the cookie on the response
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 