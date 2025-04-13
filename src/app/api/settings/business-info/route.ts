import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { businessInfoSchema } from '@/types/settings';

// This is a mock implementation. In a real app, this would use a database.
let mockSettings = new Map();

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user?.id;
    const body = await request.json();

    // Validate request body
    const validationResult = businessInfoSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Get existing settings or create new ones
    let settings = mockSettings.get(userId) || {
      businessInfo: {
        businessName: '',
        email: '',
        phone: '',
        address: '',
        website: '',
      },
      defaultSettings: {
        defaultTaxRate: 0,
        estimateExpiry: 30,
        invoiceDue: 14,
        defaultTerms: 'Payment is due within 14 days of invoice date.',
        defaultNotes: 'Thank you for your business!',
      },
    };

    // Update business info
    settings = {
      ...settings,
      businessInfo: validationResult.data,
    };

    // Save updated settings
    mockSettings.set(userId, settings);

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating business info:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating business info' },
      { status: 500 }
    );
  }
} 