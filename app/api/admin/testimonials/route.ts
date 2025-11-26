import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeUnapproved = searchParams.get("includeUnapproved") === "true"

    const session = await getSession()
    const isAdmin = session?.role === "ADMIN"

    const where = includeUnapproved && isAdmin ? {} : { approved: true }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error("Testimonials fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { quote, author, title, rating } = body

    if (!quote || !author || !title || rating === undefined) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    if (quote.length < 10 || quote.length > 500) {
      return NextResponse.json(
        { error: "Quote must be between 10 and 500 characters" },
        { status: 400 }
      )
    }

    if (author.length < 2 || author.length > 50) {
      return NextResponse.json(
        { error: "Author name must be between 2 and 50 characters" },
        { status: 400 }
      )
    }

    if (title.length < 2 || title.length > 100) {
      return NextResponse.json(
        { error: "Title must be between 2 and 100 characters" },
        { status: 400 }
      )
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be a number between 1 and 5" },
        { status: 400 }
      )
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        quote: quote.trim(),
        author: author.trim(),
        title: title.trim(),
        rating,
        approved: false,
      },
    })

    return NextResponse.json({
      success: true,
      testimonial,
      message: "Thank you! Your testimonial has been submitted for review.",
    })
  } catch (error) {
    console.error("Testimonial submission error:", error)
    return NextResponse.json(
      { error: "Failed to submit testimonial" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession()

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, approved } = body

    if (!id || typeof approved !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      )
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { approved },
    })

    return NextResponse.json({
      success: true,
      testimonial,
    })
  } catch (error) {
    console.error("Testimonial update error:", error)
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Testimonial ID is required" },
        { status: 400 }
      )
    }

    await prisma.testimonial.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    })
  } catch (error) {
    console.error("Testimonial delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    )
  }
}
