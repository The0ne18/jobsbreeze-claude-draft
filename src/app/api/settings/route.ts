import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { BusinessInfo, businessInfoSchema } from '@/types/settings';
import { snakeToCamel, camelToSnake } from '@/utils/formatters';
import { z } from 'zod';

// Default values to return if database operations fail
const DEFAULT_BUSINESS_INFO: BusinessInfo = {
  businessName: '',
  email: '',
  phone: '',
  address: '',
  website: '',
  taxRate: 0,
  invoiceDueDays: 14
};

type ApiResponse<T = any> = {
  data?: T;
  error?: string;
  details?: string;
};

async function handleError(error: unknown, defaultData?: any): Promise<NextResponse<ApiResponse>> {
  console.error('Error in settings API:', error);
  const message = error instanceof Error ? error.message : String(error);
  
  return NextResponse.json({
    error: 'An error occurred',
    details: message,
    data: defaultData
  }, { status: defaultData ? 200 : 500 });
}

async function getUserFromSession() {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    throw new Error(`Authentication error: ${sessionError.message}`);
  }
  
  const user = sessionData.session?.user;
  if (!user) {
    throw new Error('No authenticated user found');
  }
  
  return user;
}

type DbBusinessInfo = {
  user_id: string;
  business_name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  tax_rate: number;
  invoice_due_days: number;
};

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getUserFromSession();
    
    // Check if we already have business info for this user
    const { data: businessInfo, error: businessError } = await supabase
      .from('business_info')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (businessError && businessError.code !== 'PGRST116') { // Not found error
      throw new Error(`Database error: ${businessError.message}`);
    }

    // If no business info exists, create a default entry
    if (!businessInfo) {
      const defaultEntry: DbBusinessInfo = {
        user_id: user.id,
        business_name: DEFAULT_BUSINESS_INFO.businessName,
        email: DEFAULT_BUSINESS_INFO.email,
        phone: DEFAULT_BUSINESS_INFO.phone,
        address: DEFAULT_BUSINESS_INFO.address,
        website: DEFAULT_BUSINESS_INFO.website,
        tax_rate: DEFAULT_BUSINESS_INFO.taxRate,
        invoice_due_days: DEFAULT_BUSINESS_INFO.invoiceDueDays
      };

      const { data: newBusinessInfo, error: insertError } = await supabase
        .from('business_info')
        .insert(defaultEntry)
        .select()
        .single();

      if (insertError) {
        throw new Error(`Failed to create default settings: ${insertError.message}`);
      }

      return NextResponse.json({
        data: {
          businessInfo: businessInfoSchema.parse(snakeToCamel(newBusinessInfo || defaultEntry))
        }
      });
    }

    return NextResponse.json({
      data: {
        businessInfo: businessInfoSchema.parse(snakeToCamel(businessInfo))
      }
    });
  } catch (error) {
    return handleError(error, { businessInfo: DEFAULT_BUSINESS_INFO });
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const user = await getUserFromSession();
    const body = await request.json();
    
    // Validate request body against schema
    const validatedData = businessInfoSchema.parse(body.businessInfo);
    
    // Convert to database format
    const businessInfoDb: DbBusinessInfo = {
      user_id: user.id,
      business_name: validatedData.businessName,
      email: validatedData.email,
      phone: validatedData.phone,
      address: validatedData.address,
      website: validatedData.website,
      tax_rate: validatedData.taxRate,
      invoice_due_days: validatedData.invoiceDueDays
    };

    // Update or insert business info
    const { data, error } = await supabase
      .from('business_info')
      .upsert(businessInfoDb)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update business info: ${error.message}`);
    }

    return NextResponse.json({
      data: {
        businessInfo: businessInfoSchema.parse(snakeToCamel(data))
      }
    });
  } catch (error) {
    // For validation errors, return 400
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Invalid request data',
        details: error.errors
      }, { status: 400 });
    }
    
    return handleError(error);
  }
} 