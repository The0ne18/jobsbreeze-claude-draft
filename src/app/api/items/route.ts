import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('API: Fetching items...');
    
    const itemCount = await prisma.item.count();
    console.log(`API: Found ${itemCount} items in the database`);
    
    const items = await prisma.item.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    console.log('API: Items retrieved:', items);

    return NextResponse.json(items);
  } catch (error) {
    console.error('API Error fetching items:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch items' },
      { status: 500 }
    );
  }
} 