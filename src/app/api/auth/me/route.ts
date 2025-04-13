import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// This is a mock database for demonstration
// In a real app, you would use a database to retrieve users
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: 2,
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
  },
];

export async function GET(request: Request) {
  try {
    // Get the token from request cookies
    const cookieStore = request.headers.get('cookie');
    let token = null;
    
    if (cookieStore) {
      const cookies = cookieStore.split(';').map(cookie => cookie.trim());
      const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
    }
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }
    
    // In a real app, you would verify the JWT token and extract the user ID
    // Here, we're just checking if the token contains a valid user ID
    const tokenParts = token.split('-');
    if (tokenParts.length < 3 || !tokenParts[2]) {
      return NextResponse.json(
        { message: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }
    
    const userId = parseInt(tokenParts[2], 10);
    
    // Find the user by ID
    const user = MOCK_USERS.find((user) => user.id === userId);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized: User not found' },
        { status: 401 }
      );
    }
    
    // Return the user information
    return NextResponse.json({
      data: user,
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 