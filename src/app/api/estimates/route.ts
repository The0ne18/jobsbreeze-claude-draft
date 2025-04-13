import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { format } from 'date-fns';

// Helper function to generate estimate ID
function generateEstimateId(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `#${random}-${year}${month}${day}`;
}

// GET /api/estimates - Get all estimates with optional filtering
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/estimates - start');

    // Get session
    const session = await getServerSession(authOptions);
    console.log('Session check result:', session ? 'Session found' : 'No session');
    
    // For debugging only - return empty array even without auth for now
    if (!session) {
      console.log('GET /api/estimates - no session, returning empty array');
      // For debugging - return empty array instead of unauthorized error
      return NextResponse.json([]);
      
      // Uncomment when debugging is complete:
      // console.log('GET /api/estimates - unauthorized');
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';
    const search = searchParams.get('search') || '';
    
    console.log(`GET /api/estimates - params: status=${status}, search=${search}`);

    // Debug Prisma connection
    try {
      // Simple query to check if Prisma is working
      const clientCount = await prisma.client.count();
      console.log(`GET /api/estimates - client count: ${clientCount}`);
      
      // If we don't have any clients, return empty array early
      if (clientCount === 0) {
        console.log('GET /api/estimates - no clients found, returning empty array');
        return NextResponse.json([]);
      }
    } catch (prismaError) {
      console.error('Prisma connection test failed:', prismaError);
      return NextResponse.json(
        { error: 'Database connection error', details: String(prismaError) },
        { status: 500 }
      );
    }

    // Main query
    console.log('GET /api/estimates - executing main query');
    const estimates = await prisma.estimate.findMany({
      where: {
        status,
        OR: [
          {
            estimateId: {
              contains: search,
            },
          },
          {
            client: {
              OR: [
                {
                  name: {
                    contains: search,
                  },
                },
                {
                  address: {
                    contains: search,
                  },
                },
              ],
            },
          },
        ],
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
            address: true,
          },
        },
        lineItems: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    console.log(`GET /api/estimates - found ${estimates.length} estimates`);
    return NextResponse.json(estimates);
  } catch (error) {
    console.error('Error in GET /api/estimates:', error);
    return NextResponse.json(
      { error: 'Error fetching estimates', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST /api/estimates - Create a new estimate
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const {
      clientId,
      date,
      expiryDate,
      notes,
      terms,
      taxRate,
      lineItems,
      isDraft,
    } = json;

    // Calculate totals
    const subtotal = lineItems.reduce(
      (sum: number, item: { amount: number }) => sum + item.amount,
      0
    );
    const tax = subtotal * (taxRate / 100);
    const amount = subtotal + tax;

    // Create the estimate
    const estimate = await prisma.estimate.create({
      data: {
        estimateId: generateEstimateId(new Date(date)),
        clientId,
        date: new Date(date),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        notes,
        terms,
        taxRate,
        tax,
        subtotal,
        amount,
        isDraft,
        lineItems: {
          create: lineItems.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount,
          })),
        },
      },
      include: {
        client: true,
        lineItems: true,
      },
    });

    return NextResponse.json(estimate, { status: 201 });
  } catch (error) {
    console.error('Error creating estimate:', error);
    return NextResponse.json(
      { error: 'Error creating estimate', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 