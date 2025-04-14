import { supabase } from '@/lib/supabase';
import { businessInfoSchema } from '@/types/settings';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('business_info')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      return NextResponse.json({ 
        error: error.message,
        details: error
      }, { status: 500 });
    }

    // Transform snake_case to camelCase for the response
    const transformedData = data ? {
      businessName: data.business_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      website: data.website,
      taxRate: data.tax_rate,
      invoiceDueDays: data.invoice_due_days,
    } : {};

    return NextResponse.json(transformedData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = businessInfoSchema.parse(body);

    const { data, error } = await supabase
      .from('business_info')
      .upsert({
        user_id: user.id,
        business_name: validatedData.businessName,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
        website: validatedData.website,
        tax_rate: validatedData.taxRate,
        invoice_due_days: validatedData.invoiceDueDays,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ 
        error: error.message,
        details: error
      }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = businessInfoSchema.parse(body);

    const { data, error } = await supabase
      .from('business_info')
      .upsert({
        user_id: user.id,
        business_name: validatedData.businessName,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
        website: validatedData.website,
        tax_rate: validatedData.taxRate,
        invoice_due_days: validatedData.invoiceDueDays,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ 
        error: error.message,
        details: error
      }, { status: 500 });
    }

    // Transform snake_case to camelCase for the response
    const transformedData = {
      businessName: data.business_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      website: data.website,
      taxRate: data.tax_rate,
      invoiceDueDays: data.invoice_due_days,
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 