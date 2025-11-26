"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Search, Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const perfumeCategories = [
  "Woody",
  "Floral",
  "Fresh",
  "Oriental",
  "Perfume-oil",
  "Fruity",
  "Gourmand",
  "Aquatic",
  "Aromatic",
  "Spicy",
  "Vanilla",
]

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string | null
  available: boolean
  seoMeta: string | null
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)


  const [formAvailable, setFormAvailable] = useState(true)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products")
        const data = await res.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])


  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }


  const handleToggleAvailability = async (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !product.available }),
      })

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, available: !p.available } : p
          ),
        )
        toast({ title: "Product updated", description: "Availability toggled." })
      }
    } catch {
      toast({ title: "Error", description: "Failed to update product.", variant: "destructive" })
    }
  }


  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" })

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId))
        toast({ title: "Product deleted", description: "Removed successfully." })
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" })
    }
  }


  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData(e.currentTarget)
    formData.set("available", formAvailable ? "true" : "false")

    if (imageFile) {
      formData.append("image", imageFile)
    }

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          body: formData,
        })

        if (res.ok) {
          const { product } = await res.json()
          setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? product : p)))
          toast({ title: "Updated", description: "Product changes saved." })
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          body: formData,
        })

        if (res.ok) {
          const { product } = await res.json()
          setProducts((prev) => [product, ...prev])
          toast({ title: "Product created", description: "Added successfully." })
        }
      }

      setIsDialogOpen(false)
      setEditingProduct(null)
      setImageFile(null)
      setImagePreview(null)
    } catch {
      toast({ title: "Error", description: "Failed to save product.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }


  const openDialogForEdit = (product: Product) => {
    setEditingProduct(product)
    setFormAvailable(product.available)
    setImagePreview(product.image)
    setIsDialogOpen(true)
  }

  const openDialogForNew = () => {
    setEditingProduct(null)
    setFormAvailable(true)
    setImagePreview(null)
    setImageFile(null)
    setIsDialogOpen(true)
  }

 
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin h-8 w-8 border-b-2 border-[#D4AF37] rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialogForNew}>
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    name="name"
                    defaultValue={editingProduct?.name}
                    required
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Input
                    name="category"
                    list="perfumeCategories"
                    defaultValue={editingProduct?.category}
                    required
                  />
                  <datalist id="perfumeCategories">
                    {perfumeCategories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  name="description"
                  defaultValue={editingProduct?.description}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="price"
                    defaultValue={editingProduct?.price}
                    required
                  />
                </div>

                <div>
                  <Label>SEO Meta</Label>
                  <Input
                    name="seoMeta"
                    defaultValue={editingProduct?.seoMeta || ""}
                  />
                </div>
              </div>

              {/* Image */}
              <div className="space-y-2">
                <Label>Product Image</Label>

                {(imagePreview) && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-secondary">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

                <Button type="button" variant="outline" onClick={() => document.getElementById("image")?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  {editingProduct?.image || imagePreview ? "Change Image" : "Upload Image"}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formAvailable}
                  onCheckedChange={setFormAvailable}
                />
                <span>Available for purchase</span>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : editingProduct ? "Save Changes" : "Add Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Product</th>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">Status</th>
                <th className="text-right p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b last:border-none">
                  <td className="p-2">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 bg-secondary rounded overflow-hidden">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                      <span>{product.name}</span>
                    </div>
                  </td>

                  <td className="p-2">{product.category}</td>
                  <td className="p-2">${product.price}</td>

                  <td className="p-2">
                    <button
                      onClick={() => handleToggleAvailability(product.id)}
                      className={`px-3 py-1 rounded-full text-xs ${
                        product.available
                          ? "bg-green-500/10 text-green-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {product.available ? "Available" : "Unavailable"}
                    </button>
                  </td>

                  <td className="p-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDialogForEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </CardContent>
      </Card>
    </div>
  )
}
