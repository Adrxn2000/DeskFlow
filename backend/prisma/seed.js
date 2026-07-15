require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const employeePassword = await bcrypt.hash("password123", 10);
  const adminPassword = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "employee@deskflow.com" },
    update: {},
    create: {
      name: "Ellen Employee",
      email: "employee@deskflow.com",
      password: employeePassword,
      role: "EMPLOYEE",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@deskflow.com" },
    update: {},
    create: {
      name: "Alex Admin",
      email: "admin@deskflow.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Seed complete:");
  console.log("  Employee -> employee@deskflow.com / password123");
  console.log("  Admin    -> admin@deskflow.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });