
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import cloudinary from "@/lib/cloudinary"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { username: true },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Product fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const contentType = request.headers.get("content-type")
    let updateData: any = {}
    let imageUrl: string | undefined

    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData()
      
      const name = formData.get("name") as string
      const description = formData.get("description") as string
      const price = formData.get("price") as string
      const category = formData.get("category") as string
      const available = formData.get("available") === "on"
      const seoMeta = formData.get("seoMeta") as string
      const imageFile = formData.get("image") as File | null

      if (imageFile && imageFile.size > 0) {
        const existingProduct = await prisma.product.findUnique({
          where: { id },
          select: { image: true },
        })
        if (existingProduct?.image && existingProduct.image.includes("cloudinary")) {
          try {
            const urlParts = existingProduct.image.split("/")
            const publicIdWithExt = urlParts.slice(-2).join("/")
            const publicId = publicIdWithExt.split(".")[0]
            await cloudinary.uploader.destroy(publicId)
          } catch (error) {
            console.error("Failed to delete old image:", error)
          }
        }
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

      updateData = {
        name,
        description,
        price: parseFloat(price),
        category,
        available,
        seoMeta: seoMeta || null,
        ...(imageUrl && { image: imageUrl }),
      }
    } else {
      updateData = await request.json()
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: { username: true },
        },
      },
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Product update error:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      select: { image: true },
    })

    if (product?.image && product.image.includes("cloudinary")) {
      try {
        const urlParts = product.image.split("/")
        const publicIdWithExt = urlParts.slice(-2).join("/") 
        const publicId = publicIdWithExt.split(".")[0] 

        await cloudinary.uploader.destroy(publicId)
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error)
      }
    }

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Product delete error:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}