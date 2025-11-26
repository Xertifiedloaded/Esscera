

import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  const email = "admin@esscera.com.ng"
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

  console.log("Admin created or already exists:", admin)
}

main()
  .then(() => {
    console.log("✔ Admin creation completed.")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Failed to create admin:", error)
    process.exit(1)
  })
