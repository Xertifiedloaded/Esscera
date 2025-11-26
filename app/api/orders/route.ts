import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const where = session.role === "ADMIN" ? {} : { userId: session.id }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: { username: true, email: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Please login to place an order" }, { status: 401 })
    }

    const data = await request.json()

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.id },
      include: { product: true },
    })

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }


    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const shipping = subtotal >= 200 ? 0 : 20
    const total = subtotal + shipping

    const order = await prisma.order.create({
      data: {
        userId: session.id,
        total,
        paymentMethod: data.paymentMethod,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    })


    await prisma.cartItem.deleteMany({
      where: { userId: session.id },
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Order create error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
