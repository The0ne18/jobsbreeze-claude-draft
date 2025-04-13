import { NextResponse } from 'next/server';
import { z } from 'zod';

// Simple password reset validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = resetPasswordSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: result.error.errors },
        { status: 400 }
      );
    }
    
    const { token, password } = result.data;
    
    // In a real app, you would:
    // 1. Verify the token from the database
    // 2. Check if it's not expired
    // 3. Find the associated user
    // 4. Update their password with a hashed version
    
    // For the mock, we'll just validate token format and return success
    const tokenParts = token.split('-');
    
    if (!token.startsWith('reset-token-') || tokenParts.length < 3) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }
    
    // Log for demonstration purposes
    console.log(`Password reset for user ID ${tokenParts[2]} successful`);
    
    // Return success
    return NextResponse.json({
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 