// createAdmin.js
const { PrismaClient } = require('./generated/prisma'); // ✅ updated path to generated client
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'rlgalathura@gmail.com';  // 🔹 change this
  const name = 'Super Admin';             // 🔹 change this
  const password = 'Hurathal1#';          // 🔹 change this
  const role = 'admin';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  if (existingAdmin) {
    console.log('Admin already exists:', existingAdmin.email);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin
  const admin = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  console.log('✅ Admin created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
