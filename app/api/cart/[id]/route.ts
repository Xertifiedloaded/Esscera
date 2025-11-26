import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { quantity } = await request.json()

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id, userId: session.id },
      })
      return NextResponse.json({ success: true })
    }

    const item = await prisma.cartItem.update({
      where: { id, userId: session.id },
      data: { quantity },
      include: { product: true },
    })

    return NextResponse.json({ item })
  } catch (error) {
    console.error("Cart update error:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.cartItem.delete({
      where: { id, userId: session.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cart item delete error:", error)
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
  }
}
