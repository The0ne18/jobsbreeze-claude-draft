import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Create a Supabase client using cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    }
  });

  // Get session from cookie
  const { data: { session } } = await supabase.auth.getSession();
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route) || pathname === '/');

  // Redirect authenticated users away from public routes
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect private routes
  if (!isPublicRoute && !session) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 