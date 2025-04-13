import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Mock in-memory storage for settings
let mockSettings = new Map();

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user?.id;
    const settings = mockSettings.get(userId);

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
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
      });
    }

    // Return existing settings
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching settings' },
      { status: 500 }
    );
  }
} 