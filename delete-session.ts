
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⏳ Logging out all users from all devices...");

  const result = await prisma.session.deleteMany({});

  console.log(`✅ Done. ${result.count} session(s) removed.`);
  console.log("🔌 All users have been logged out from every device.");

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("❌ Error:", err);
  await prisma.$disconnect();
  process.exit(1);
});
