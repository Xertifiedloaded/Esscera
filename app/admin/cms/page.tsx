"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Save, Plus, Trash2, Upload, AlertCircle, Loader2, Eye, Image, CheckCircle2 
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface HeroSlide {
  id?: string
  title: string
  highlight: string
  subtitle: string
  image: string
  publicId?: string
}

interface CMSContent {
  page: string
  section: string
  content: Record<string, any>
}

export default function AdminCMSPage() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [aboutContent, setAboutContent] = useState({
    title: "",
    description: "",
  })
  const [footerContent, setFooterContent] = useState({
    address: "",
    phone: "",
    email: "",
    whatsapp: "",
  })

  const [loading, setLoading] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchCMSContent()
  }, [])

  const fetchCMSContent = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cms')
      const data = await response.json()
      
      if (data.content) {
        data.content.forEach((item: CMSContent) => {
          if (item.page === 'home' && item.section === 'hero') {
            setHeroSlides(item.content.slides || [])
          } else if (item.page === 'about' && item.section === 'story') {
            setAboutContent(item.content)
          } else if (item.page === 'footer' && item.section === 'contact') {
            setFooterContent(item.content)
          }
        })
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load content." })
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const uploadToBackend = async (file: File, slideIndex: number): Promise<{ url: string; publicId: string }> => {
    setUploadingIndex(slideIndex)
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'perfume-hero-slides')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      return await response.json()
    } finally {
      setUploadingIndex(null)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideIndex: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const { url, publicId } = await uploadToBackend(file, slideIndex)

      const updatedSlides = [...heroSlides]
      updatedSlides[slideIndex].image = url
      updatedSlides[slideIndex].publicId = publicId
      setHeroSlides(updatedSlides)

      showMessage("success", "Image uploaded successfully")
    } catch {}
  }

  const saveHeroSlides = async () => {
    if (heroSlides.some(s => !s.image)) {
      return showMessage("error", "Each slide must have an image")
    }

    try {
      setSaving(true)

      await fetch('/api/cms', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: "home",
          section: "hero",
          content: { slides: heroSlides }
        })
      })

      showMessage("success", "Hero slides saved!")
    } catch {
      showMessage("error", "Failed to save hero slides.")
    } finally {
      setSaving(false)
    }
  }

  const addHeroSlide = () => {
    setHeroSlides([
      ...heroSlides,
      {
        title: "New",
        highlight: "Slide",
        subtitle: "Add subtitle",
        image: "",
      },
    ])
  }

  const removeHeroSlide = (index: number) => {
    if (heroSlides.length <= 1) {
      return showMessage("error", "At least one slide required")
    }
    setHeroSlides(heroSlides.filter((_, i) => i !== index))
  }

  const updateHeroSlide = (index: number, field: keyof HeroSlide, value: string) => {
    const updated = [...heroSlides]
    updated[index][field] = value
    setHeroSlides(updated)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
        <p className="text-white">Loading CMS...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-8 text-white">
      
      {message && (
        <Alert
          variant={message.type === "error" ? "destructive" : "default"}
          className="mb-6 bg-transparent border text-white"
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="bg-transparent border border-white/20">
          <TabsTrigger value="hero" className="data-[state=active]:bg-white data-[state=active]:text-black">
            Hero Section
          </TabsTrigger>
          <TabsTrigger value="about" className="data-[state=active]:bg-white data-[state=active]:text-black">
            About Page
          </TabsTrigger>
          <TabsTrigger value="footer" className="data-[state=active]:bg-white data-[state=active]:text-black">
            Footer
          </TabsTrigger>
        </TabsList>

        {/* HERO SECTION */}
        <TabsContent value="hero" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Hero Slides</h2>
            <Button onClick={addHeroSlide} className="bg-white text-black hover:bg-white/90">
              <Plus className="h-4 w-4 mr-2" /> Add Slide
            </Button>
          </div>

          {heroSlides.map((slide, index) => (
            <Card key={index} className="bg-transparent border border-white/20 shadow-none">
              <CardHeader>
                <CardTitle>Slide {index + 1}</CardTitle>
                <CardDescription className="text-white/70">
                  Configure content for this slide.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* IMAGE UPLOAD */}
                <div className="space-y-2">
                  <Label>Background Image</Label>

                  {slide.image ? (
                    <div>
                      <img
                        src={slide.image}
                        className="w-full h-64 object-cover rounded border border-white/20"
                      />
                      <Input
                        type="file"
                        accept="image/*"
                        className="mt-3 bg-transparent border-white/20"
                        onChange={(e) => handleImageUpload(e, index)}
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-white/30 p-8 text-center rounded">
                      <Upload className="h-10 w-10 mx-auto mb-2 text-white/50" />
                      <Input
                        type="file"
                        accept="image/*"
                        className="mx-auto max-w-xs bg-transparent border-white/20"
                        onChange={(e) => handleImageUpload(e, index)}
                      />
                    </div>
                  )}
                </div>

                {/* TITLE */}
                <div>
                  <Label>Title</Label>
                  <Input
                    className="bg-transparent border-white/30"
                    value={slide.title}
                    onChange={(e) => updateHeroSlide(index, "title", e.target.value)}
                  />
                </div>

                {/* HIGHLIGHT */}
                <div>
                  <Label>Highlight</Label>
                  <Input
                    className="bg-transparent border-white/30"
                    value={slide.highlight}
                    onChange={(e) => updateHeroSlide(index, "highlight", e.target.value)}
                  />
                </div>

                {/* SUBTITLE */}
                <div>
                  <Label>Subtitle</Label>
                  <Textarea
                    className="bg-transparent border-white/30"
                    rows={3}
                    value={slide.subtitle}
                    onChange={(e) => updateHeroSlide(index, "subtitle", e.target.value)}
                  />
                </div>

                {heroSlides.length > 1 && (
                  <Button
                    variant="destructive"
                    onClick={() => removeHeroSlide(index)}
                    className="bg-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}

          <Button
            onClick={saveHeroSlides}
            className="w-full bg-white text-black font-semibold hover:bg-white/90"
          >
            <Save className="mr-2 h-4 w-4" /> Save Hero Slides
          </Button>
        </TabsContent>

        {/* ABOUT PAGE */}
        <TabsContent value="about">
          <Card className="bg-transparent border border-white/20">
            <CardHeader>
              <CardTitle>About Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  className="bg-transparent border-white/30"
                  value={aboutContent.title}
                  onChange={(e) =>
                    setAboutContent({ ...aboutContent, title: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  rows={8}
                  className="bg-transparent border-white/30"
                  value={aboutContent.description}
                  onChange={(e) =>
                    setAboutContent({ ...aboutContent, description: e.target.value })
                  }
                />
              </div>

              <Button className="w-full bg-white text-black hover:bg-white/90">
                <Save className="mr-2" /> Save About Page
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FOOTER */}
        <TabsContent value="footer">
          <Card className="bg-transparent border border-white/20">
            <CardHeader>
              <CardTitle>Footer Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div>
                <Label>Address</Label>
                <Input
                  className="bg-transparent border-white/30"
                  value={footerContent.address}
                  onChange={(e) =>
                    setFooterContent({ ...footerContent, address: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input
                    className="bg-transparent border-white/30"
                    value={footerContent.phone}
                    onChange={(e) =>
                      setFooterContent({ ...footerContent, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    className="bg-transparent border-white/30"
                    value={footerContent.email}
                    onChange={(e) =>
                      setFooterContent({ ...footerContent, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>WhatsApp</Label>
                <Input
                  className="bg-transparent border-white/30"
                  value={footerContent.whatsapp}
                  onChange={(e) =>
                    setFooterContent({ ...footerContent, whatsapp: e.target.value })
                  }
                />
              </div>

              <Button className="w-full bg-white text-black hover:bg-white/90">
                <Save className="mr-2" /> Save Footer Info
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
