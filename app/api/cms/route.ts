import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import cloudinary from "@/lib/cloudinary"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page")
    const section = searchParams.get("section")

    const where: Record<string, string> = {}

    if (page) where.page = page
    if (section) where.section = section

    const content = await prisma.cMSContent.findMany({ where })

    return NextResponse.json({ content })
  } catch (error) {
    console.error("CMS fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch CMS content" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { page, section, content } = await request.json()

    if (!page || !section) {
      return NextResponse.json(
        { error: "Page and section are required" }, 
        { status: 400 }
      )
    }

    const cmsContent = await prisma.cMSContent.upsert({
      where: {
        page_section: { page, section },
      },
      update: { 
        content,
        updatedAt: new Date()
      },
      create: { 
        page, 
        section, 
        content 
      },
    })

    return NextResponse.json({ 
      success: true,
      content: cmsContent 
    })
  } catch (error) {
    console.error("CMS update error:", error)
    return NextResponse.json({ error: "Failed to update CMS content" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page")
    const section = searchParams.get("section")

    if (!page || !section) {
      return NextResponse.json(
        { error: "Page and section are required" }, 
        { status: 400 }
      )
    }

    const existingContent = await prisma.cMSContent.findUnique({
      where: { page_section: { page, section } }
    })

    if (existingContent) {
      const content = existingContent.content as any
      if (content.slides) {
        for (const slide of content.slides) {
          if (slide.image) {
            try {
              const publicId = extractPublicId(slide.image)
              if (publicId) {
                await cloudinary.uploader.destroy(publicId)
              }
            } catch (err) {
              console.error("Failed to delete image:", err)
            }
          }
        }
      }

      await prisma.cMSContent.delete({
        where: { page_section: { page, section } }
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: "CMS content deleted" 
    })
  } catch (error) {
    console.error("CMS delete error:", error)
    return NextResponse.json({ error: "Failed to delete CMS content" }, { status: 500 })
  }
}

function extractPublicId(url: string): string | null {
  try {
    const matches = url.match(/\/([^\/]+)\.[a-z]+$/)
    return matches ? matches[1] : null
  } catch {
    return null
  }
}