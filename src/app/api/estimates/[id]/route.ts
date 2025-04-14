import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

type RouteParams = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

// GET /api/estimates/[id] - Get a single estimate
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch estimate with related data
    const { data: estimate, error } = await supabase
      .from('estimates')
      .select(`
        *,
        clients (*),
        line_items (*)
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching estimate:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!estimate) {
      return NextResponse.json({ error: 'Estimate not found' }, { status: 404 });
    }

    return NextResponse.json(estimate);
  } catch (error) {
    console.error('Error fetching estimate:', error);
    return NextResponse.json(
      { error: 'Error fetching estimate' },
      { status: 500 }
    );
  }
}

// PUT /api/estimates/[id] - Update an estimate
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const {
      client_id,
      date,
      expiry_date,
      notes,
      terms,
      tax_rate,
      line_items,
      is_draft,
    } = json;

    // Calculate totals
    const subtotal = line_items.reduce(
      (sum: number, item: { amount: number }) => sum + item.amount,
      0
    );
    const tax = subtotal * (tax_rate / 100);
    const amount = subtotal + tax;

    // Delete existing line items
    const { error: deleteError } = await supabase
      .from('line_items')
      .delete()
      .eq('estimate_id', params.id);

    if (deleteError) {
      throw deleteError;
    }

    // Update estimate
    const { data: estimate, error: updateError } = await supabase
      .from('estimates')
      .update({
        client_id,
        date,
        expiry_date,
        notes,
        terms,
        tax_rate,
        tax,
        subtotal,
        amount,
        is_draft,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Insert new line items
    const { error: insertError } = await supabase
      .from('line_items')
      .insert(
        line_items.map((item: any) => ({
          estimate_id: params.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
        }))
      );

    if (insertError) {
      throw insertError;
    }

    // Fetch updated estimate with related data
    const { data: updatedEstimate, error: fetchError } = await supabase
      .from('estimates')
      .select(`
        *,
        clients (*),
        line_items (*)
      `)
      .eq('id', params.id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    return NextResponse.json(updatedEstimate);
  } catch (error: any) {
    console.error('Error updating estimate:', error);
    return NextResponse.json(
      { error: error.message || 'Error updating estimate' },
      { status: 500 }
    );
  }
}

// DELETE /api/estimates/[id] - Delete an estimate
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the estimate (line items will be cascade deleted due to foreign key constraint)
    const { error } = await supabase
      .from('estimates')
      .delete()
      .eq('id', params.id);

    if (error) {
      throw error;
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Error deleting estimate:', error);
    return NextResponse.json(
      { error: error.message || 'Error deleting estimate' },
      { status: 500 }
    );
  }
} 