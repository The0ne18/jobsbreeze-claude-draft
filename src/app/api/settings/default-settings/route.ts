import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { defaultSettingsSchema } from '@/types/settings';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use the ID as a string, no need to parseInt for UUID
    const userId = session.user.id;
    const body = await request.json();

    // Validate request body
    const validationResult = defaultSettingsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Update or create settings
    const settings = await prisma.settings.upsert({
      where: { userId },
      create: {
        userId,
        businessName: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        ...validationResult.data,
      },
      update: validationResult.data,
    });

    // Transform the data to match the expected format
    return NextResponse.json({
      businessInfo: {
        businessName: settings.businessName,
        email: settings.email,
        phone: settings.phone,
        address: settings.address,
        website: settings.website,
      },
      defaultSettings: {
        defaultTaxRate: settings.defaultTaxRate,
        estimateExpiry: settings.estimateExpiry,
        invoiceDue: settings.invoiceDue,
        defaultTerms: settings.defaultTerms,
        defaultNotes: settings.defaultNotes,
      },
    });
  } catch (error) {
    console.error('Error updating default settings:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating default settings' },
      { status: 500 }
    );
  }
} 