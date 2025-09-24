// prisma/seed.js
const { PrismaClient } = require("../generated/prisma"); // Use your generated Prisma client path

const prisma = new PrismaClient();

const categories = [
  "Computer Science",
  "Mathematics",
  "Arts & Humanities",
  "Business",
  "Languages",
  "Data Science",
  "Design",
  "Engineering",
  "Health & Medicine",
  "Personal Development",
];

async function main() {
  for (let i = 0; i < categories.length; i++) {
    const name = categories[i];
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✅ Categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });