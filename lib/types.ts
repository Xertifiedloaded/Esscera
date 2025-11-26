export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  available: boolean
  seoMeta?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
}

export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "user"
  createdAt: Date
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  paymentMethod: "stripe" | "whatsapp"
  createdAt: Date
}

export interface CMSContent {
  id: string
  page: string
  section: string
  content: Record<string, unknown>
  updatedAt: Date
}
