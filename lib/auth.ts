import { cookies } from "next/headers"
import { prisma } from "./prisma"
import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"

// Secret
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
)

export interface JWTPayload {
  userId: string
  email: string
  role: string
}


export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}


export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch {
    return null
  }
}

export async function createSession(user: any, req: Request) {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("client-ip") ||
    "unknown"

  const userAgent = req.headers.get("user-agent") || "unknown"

  const token = await createToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      device: userAgent,
      ipAddress: ip,
      location: null,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    },
  })

  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return token
}


export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload) return null

  const dbSession = await prisma.session.findFirst({
    where: { token },
    include: { user: true },
  })

  if (!dbSession) return null


  if (dbSession.expiresAt && dbSession.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: dbSession.id } })
    return null
  }

  return {
    id: dbSession.user.id,
    username: dbSession.user.username,
    email: dbSession.user.email,
    role: dbSession.user.role,
    createdAt: dbSession.user.createdAt,
  }
}

export async function logoutCurrentDevice() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (token) {
    await prisma.session.deleteMany({ where: { token } })
    cookieStore.delete("auth-token")
  }
}


export async function logoutAllDevices(userId: string) {
  await prisma.session.deleteMany({
    where: { userId },
  })
}


export async function logoutEveryone() {
  await prisma.session.deleteMany({})
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
