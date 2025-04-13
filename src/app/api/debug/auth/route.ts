import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    console.log('Auth debug check - starting');
    const session = await getServerSession(authOptions);
    console.log('Auth debug check - session:', session ? 'Session exists' : 'No session');
    
    if (session) {
      return NextResponse.json({
        authenticated: true,
        user: session.user,
        expires: session.expires,
      });
    } else {
      return NextResponse.json({
        authenticated: false,
        message: 'No active session',
      });
    }
  } catch (error) {
    console.error('Auth debug error:', error);
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
} 