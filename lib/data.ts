import type { Product, User, Order, CMSContent } from "./types"

export const products: Product[] = [
  {
    id: "1",
    name: "Noir Absolu",
    description:
      "A captivating blend of dark oud, black amber, and vanilla bourbon. An enigmatic fragrance for the bold and mysterious.",
    price: 295,
    category: "Eau de Parfum",
    image: "/luxury-black-perfume-bottle-gold-accents.jpg",
    available: true,
    seoMeta: "Luxury oud perfume with amber and vanilla notes",
    createdBy: "admin",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Or Royal",
    description: "The essence of opulence. Rose de Mai, saffron, and precious woods create a regal symphony of scent.",
    price: 450,
    category: "Parfum",
    image: "/luxury-gold-perfume-bottle-ornate-design.jpg",
    available: true,
    seoMeta: "Royal rose and saffron luxury perfume",
    createdBy: "admin",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    name: "Velvet Midnight",
    description: "Whispers of jasmine sambac, tuberose, and musk create an intoxicating nocturnal elixir.",
    price: 325,
    category: "Eau de Parfum",
    image: "/luxury-purple-velvet-perfume-bottle-elegant.jpg",
    available: true,
    seoMeta: "Jasmine and tuberose evening perfume",
    createdBy: "admin",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "4",
    name: "Amber Dynastie",
    description: "A warm embrace of amber, benzoin, and labdanum. Timeless elegance in a bottle.",
    price: 275,
    category: "Eau de Parfum",
    image: "/luxury-amber-colored-perfume-bottle-classic.jpg",
    available: true,
    seoMeta: "Warm amber luxury fragrance",
    createdBy: "admin",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "5",
    name: "Iris Impérial",
    description: "The noble iris root meets Florentine orris and soft suede. Sophistication personified.",
    price: 520,
    category: "Parfum",
    image: "/luxury-iris-purple-perfume-bottle-sophisticated.jpg",
    available: false,
    seoMeta: "Iris and orris luxury perfume",
    createdBy: "admin",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "6",
    name: "Bois Précieux",
    description: "Rare sandalwood, cedar atlas, and vetiver create a refined woody masterpiece.",
    price: 385,
    category: "Eau de Parfum",
    image: "/luxury-wooden-brown-perfume-bottle-masculine.jpg",
    available: true,
    seoMeta: "Sandalwood and cedar luxury perfume",
    createdBy: "admin",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
]

// Mock Users Data
export const users: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@luxeparfum.com",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
]

// Mock Orders Data
export const orders: Order[] = []

// Mock CMS Content
export const cmsContent: CMSContent[] = [
  {
    id: "1",
    page: "home",
    section: "hero",
    content: {
      title: "The Art of Luxury",
      subtitle: "Discover Timeless Elegance",
      description: "Exquisite fragrances crafted for those who appreciate the finer things in life.",
    },
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    page: "about",
    section: "story",
    content: {
      title: "Our Heritage",
      description:
        "Founded in the heart of Paris, LUXE PARFUM has been crafting exceptional fragrances for over a century.",
    },
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    page: "footer",
    section: "contact",
    content: {
      address: "12 Avenue Montaigne, Paris 75008",
      phone: "+33 1 42 68 00 00",
      email: "contact@luxeparfum.com",
      whatsapp: "+33612345678",
    },
    updatedAt: new Date("2024-01-01"),
  },
]

export function getProducts() {
  return products
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: string) {
  return products.filter((p) => p.category === category)
}

export function getAvailableProducts() {
  return products.filter((p) => p.available)
}

export function getCMSContent(page: string, section?: string) {
  if (section) {
    return cmsContent.find((c) => c.page === page && c.section === section)
  }
  return cmsContent.filter((c) => c.page === page)
}

export type { CMSContent }
