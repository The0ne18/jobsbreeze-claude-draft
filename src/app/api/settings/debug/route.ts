import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Check auth status
    const { data: sessionData, error: authError } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    
    // Check connection to business_info table
    const { data: tableInfo, error: tableError } = await supabase
      .from('business_info')
      .select('count(*)')
      .limit(1);
    
    // Try to get schema info, but this might not work due to permissions
    let schemaInfo = null;
    let schemaError = null;
    try {
      const result = await supabase
        .from('pg_catalog.pg_policies')
        .select('*')
        .eq('tablename', 'business_info');
      schemaInfo = result.data;
      schemaError = result.error;
    } catch (e) {
      schemaError = { message: 'Cannot query system tables' };
    }

    return NextResponse.json({
      authenticated: !!user,
      sessionData: sessionData ? {
        hasSession: !!sessionData.session,
        user: user ? {
          id: user.id,
          email: user.email,
        } : null
      } : null,
      authError: authError ? {
        message: authError.message,
        status: authError.status,
      } : null,
      databaseConnected: !tableError,
      tableError: tableError ? {
        message: tableError.message,
        code: tableError.code,
        details: tableError.details,
      } : null,
      tableInfo,
      schemaPolicies: schemaInfo,
      schemaError: schemaError ? (typeof schemaError === 'object' ? schemaError.message : String(schemaError)) : null,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Unexpected error in debug endpoint',
      details: String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 