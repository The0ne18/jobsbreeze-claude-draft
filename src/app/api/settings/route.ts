import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { BusinessInfo } from '@/types/settings';
import { snakeToCamel, camelToSnake } from '@/utils/formatters';

// Default values to return if database operations fail
const DEFAULT_BUSINESS_INFO = {
  business_name: '',
  email: '',
  phone: '',
  address: '',
  website: '',
  tax_rate: 0,
  invoice_due_days: 14,
};

// Default settings that will be returned if database operations fail
const DEFAULT_SETTINGS = {
  defaultTaxRate: 0,
  estimateExpiry: 30,
  invoiceDue: 14,
  defaultTerms: 'Payment is due within 14 days of invoice date.',
  defaultNotes: 'Thank you for your business!'
};

export async function GET() {
  try {
    // Get the user's session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json({ 
        error: 'Authentication error', 
        details: sessionError.message,
        businessInfo: snakeToCamel(DEFAULT_BUSINESS_INFO),
        defaultSettings: DEFAULT_SETTINGS
      }, { status: 200 }); // Return 200 with default data even on auth error
    }

    if (!sessionData.session) {
      console.warn('No session found');
      return NextResponse.json({ 
        error: 'No session found',
        businessInfo: snakeToCamel(DEFAULT_BUSINESS_INFO),
        defaultSettings: DEFAULT_SETTINGS
      }, { status: 200 }); // Return 200 with default data
    }

    const user = sessionData.session.user;
    
    if (!user) {
      console.warn('No user found in session');
      return NextResponse.json({ 
        error: 'No user found in session',
        businessInfo: snakeToCamel(DEFAULT_BUSINESS_INFO),
        defaultSettings: DEFAULT_SETTINGS
      }, { status: 200 }); // Return 200 with default data
    }

    // Check if we already have business info for this user
    const { data: businessInfo, error: businessError } = await supabase
      .from('business_info')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (businessError && businessError.code !== 'PGRST116') { // Not found error
      console.error('Error fetching business info:', businessError);
      return NextResponse.json({ 
        error: 'Database error',
        details: businessError.message,
        businessInfo: snakeToCamel(DEFAULT_BUSINESS_INFO),
        defaultSettings: DEFAULT_SETTINGS
      }, { status: 200 }); // Return 200 with default data
    }

    // If no business info exists, create a default entry
    if (!businessInfo) {
      const defaultEntry = {
        user_id: user.id,
        ...DEFAULT_BUSINESS_INFO
      };

      const { data: newBusinessInfo, error: insertError } = await supabase
        .from('business_info')
        .insert(defaultEntry)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating default business info:', insertError);
        return NextResponse.json({ 
          error: 'Failed to create default settings',
          details: insertError.message,
          businessInfo: snakeToCamel(DEFAULT_BUSINESS_INFO),
          defaultSettings: DEFAULT_SETTINGS
        }, { status: 200 }); // Return 200 with default data
      }

      return NextResponse.json({
        businessInfo: snakeToCamel(newBusinessInfo || DEFAULT_BUSINESS_INFO),
        defaultSettings: DEFAULT_SETTINGS
      });
    }

    return NextResponse.json({
      businessInfo: snakeToCamel(businessInfo),
      defaultSettings: DEFAULT_SETTINGS
    });
  } catch (error) {
    console.error('Unhandled error in settings GET:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error),
      businessInfo: snakeToCamel(DEFAULT_BUSINESS_INFO),
      defaultSettings: DEFAULT_SETTINGS
    }, { status: 200 }); // Return 200 with default data
  }
}

export async function PUT(request: Request) {
  try {
    // Get the user's session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json({ error: 'Authentication error', details: sessionError.message }, { status: 401 });
    }

    if (!sessionData.session || !sessionData.session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = sessionData.session.user;
    const { businessInfo } = await request.json();

    // Convert from camelCase to snake_case for DB
    const businessInfoDb = camelToSnake(businessInfo) as Record<string, any>;
    businessInfoDb.user_id = user.id;

    // Update or insert business info
    const { data, error } = await supabase
      .from('business_info')
      .upsert(businessInfoDb)
      .select()
      .single();

    if (error) {
      console.error('Error updating business info:', error);
      return NextResponse.json({ 
        error: 'Failed to update business info', 
        details: error.message,
        businessInfo: businessInfo // Return the original data that was attempted to be saved
      }, { status: 500 });
    }

    return NextResponse.json({ businessInfo: snakeToCamel(data) });
  } catch (error) {
    console.error('Unhandled error in settings PUT:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 