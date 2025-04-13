import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = {
      clients: 0,
      estimates: 0,
    };

    // Add test clients if none exist
    const clientCount = await prisma.client.count();
    if (clientCount === 0) {
      // Create test clients
      const clients = [
        {
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '555-123-4567',
          address: '123 Main St, Anytown, CA 90210',
          notes: 'Residential customer, prefers afternoon appointments',
        },
        {
          name: 'Acme Corporation',
          email: 'info@acmecorp.example',
          phone: '555-987-6543',
          address: '1000 Business Ave, Commerce City, NY 10001',
          notes: 'Corporate account, requires PO number for all invoices',
        },
        {
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '555-222-3333',
          address: '456 Oak Lane, Springfield, IL 62701',
          notes: 'New customer, referred by John Smith',
        },
      ];

      for (const client of clients) {
        await prisma.client.create({
          data: client
        });
        results.clients++;
      }
    }

    // Add test estimate if none exist
    const estimateCount = await prisma.estimate.count();
    if (estimateCount === 0) {
      // Get the first client to create an estimate for
      const client = await prisma.client.findFirst();
      if (client) {
        // Create a test estimate
        await prisma.estimate.create({
          data: {
            estimateId: '#01-20250413-01',
            clientId: client.id,
            status: 'PENDING',
            isDraft: true,
            amount: 1250.00,
            subtotal: 1000.00,
            tax: 250.00,
            taxRate: 25.00,
            date: new Date(),
            lineItems: {
              create: [
                {
                  description: 'Design Services',
                  quantity: 10,
                  unitPrice: 50.00,
                  amount: 500.00,
                },
                {
                  description: 'Development Work',
                  quantity: 5,
                  unitPrice: 100.00,
                  amount: 500.00,
                },
              ],
            },
          },
        });
        results.estimates++;
      }
    }

    return NextResponse.json({
      message: 'Database seeded successfully',
      results,
      currentCounts: {
        clients: await prisma.client.count(),
        estimates: await prisma.estimate.count(),
      }
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Error seeding database', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 