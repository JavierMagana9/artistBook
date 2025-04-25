const prisma = require('../src/utils/prisma');

async function main() {
  // Test query
  const userCount = await prisma.user.count();
  console.log(`Database connected! User count: ${userCount}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });