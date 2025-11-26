
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "admin@esscera.com"
  const username = "admin"
  const password = "admin123"

  const hashedPassword = await bcrypt.hash(password, 10)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      username,
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  console.log("✔ Admin created:", admin)
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error("❌ Error seeding admin:", err)
    prisma.$disconnect()
    process.exit(1)
  })
