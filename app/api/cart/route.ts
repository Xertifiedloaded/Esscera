import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ items: [] })
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: session.id },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Cart fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Please login to add items to cart" }, { status: 401 })
    }

    const { productId, quantity = 1 } = await request.json()

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.id,
          productId,
        },
      },
    })

    let item

    if (existingItem) {
      item = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      })
    } else {
      item = await prisma.cartItem.create({
        data: {
          userId: session.id,
          productId,
          quantity,
        },
        include: { product: true },
      })
    }

    return NextResponse.json({ item })
  } catch (error) {
    console.error("Cart add error:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.cartItem.deleteMany({
      where: { userId: session.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cart clear error:", error)
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
  }
}
