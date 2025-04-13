import { NextResponse } from 'next/server';
import { z } from 'zod';

// This is a mock database for demonstration
// In a real app, you would use a database to verify and reset users
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin User',
  },
  {
    id: 2,
    email: 'user@example.com',
    name: 'Regular User',
  },
];

// Simple email validation schema
const resetSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = resetSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: result.error.errors },
        { status: 400 }
      );
    }
    
    const { email } = result.data;
    
    // Check if the email exists in our database
    const user = MOCK_USERS.find((user) => user.email === email);
    
    // Always return success even if the email doesn't exist (security best practice)
    // In a real app, you would:
    // 1. Generate a reset token and store it in your database
    // 2. Send an email with a link containing the token
    // 3. When the user clicks the link, verify the token and allow reset
    
    // For the mock, we'll just return a fake token in the response
    const resetToken = user ? `reset-token-${user.id}-${Date.now()}` : null;
    
    // Log the token for demonstration purposes
    if (resetToken) {
      console.log(`Reset token for ${email}: ${resetToken}`);
      console.log(`Reset link: http://localhost:3000/auth/reset-password?token=${resetToken}`);
    }
    
    // Return success in all cases
    return NextResponse.json({
      message: 'If your email is registered with us, you will receive a password reset link shortly',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 