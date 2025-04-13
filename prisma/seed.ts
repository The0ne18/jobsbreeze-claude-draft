import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing items to avoid duplicates
  await prisma.item.deleteMany();
  
  // Create the items we see in the UI
  const items = [
    {
      name: 'sheet',
      category: 'materials',
      price: 50.00,
      description: 'Standard sheet material',
      taxable: true
    },
    {
      name: 'wood',
      category: 'materials',
      price: 100.00,
      description: 'Wood material',
      taxable: true
    }
  ];
  
  console.log('Creating items...');
  for (const item of items) {
    await prisma.item.create({
      data: item
    });
  }
  
  console.log('Items seeded successfully!');
  
  // Verify items were created
  const createdItems = await prisma.item.findMany();
  console.log('Created items:', createdItems);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 