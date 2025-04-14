import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { EstimateStatus } from '@/types/estimates';

// PATCH /api/estimates/[id]/status - Update estimate status
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } } // Use literal inline type for context
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const { status } = json;

    // Validate status
    if (!['PENDING', 'APPROVED', 'DECLINED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update the estimate status
    const estimate = await prisma.estimate.update({
      where: {
        id: context.params.id, // Access id via context.params.id
      },
      data: {
        status: status as EstimateStatus,
        isDraft: false, // When changing status, estimate is no longer a draft
      },
      include: {
        client: true,
        lineItems: true,
      },
    });

    return NextResponse.json(estimate);
  } catch (error) {
    console.error('Error updating estimate status:', error);
    return NextResponse.json(
      { error: 'Error updating estimate status' },
      { status: 500 }
    );
  }
} 