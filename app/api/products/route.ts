import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import cloudinary from "@/lib/cloudinary"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const available = searchParams.get("available")

    const where: Record<string, unknown> = {}

    if (category) where.category = category
    if (available === "true") where.available = true

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { username: true } }
      }
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)
    const category = formData.get("category") as string
    const available = formData.get("available") === "true"
    const seoMeta = formData.get("seoMeta") as string
    const imageFile = formData.get("image") as File | null

    let imageUrl = "/placeholder.svg?height=400&width=300"

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`

      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "products",
        resource_type: "auto",
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          { quality: "auto" }
        ]
      })

      imageUrl = uploadResponse.secure_url
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        category,
        image: imageUrl,
        available,
        seoMeta: seoMeta || undefined, // <-- FIXED
        createdById: session.id
      }
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Product create error:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
