import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// Define params type for route segment
type EstimateParams = { params: { id: string } };

// GET /api/estimates/[id] - Get a single estimate
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const estimate = await prisma.estimate.findUnique({
      where: {
        id: params.id,
      },
      include: {
        client: true,
        lineItems: true,
      },
    });

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
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Update the estimate using a transaction
    const estimate = await prisma.$transaction(async (prisma) => {
      // Delete existing line items
      await prisma.lineItem.deleteMany({
        where: {
          estimateId: params.id,
        },
      });

      // Update the estimate and create new line items
      return prisma.estimate.update({
        where: {
          id: params.id,
        },
        data: {
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
    });

    return NextResponse.json(estimate);
  } catch (error) {
    console.error('Error updating estimate:', error);
    return NextResponse.json(
      { error: 'Error updating estimate' },
      { status: 500 }
    );
  }
}

// DELETE /api/estimates/[id] - Delete an estimate
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.estimate.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting estimate:', error);
    return NextResponse.json(
      { error: 'Error deleting estimate' },
      { status: 500 }
    );
  }
} 