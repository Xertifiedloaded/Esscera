import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "About | ESSCERA",
  description: "Discover the story behind ESSCERA and our commitment to luxury perfumery.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="relative py-32 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-4">Our Story</p>
            <h1 className="text-5xl font-bold text-foreground mb-6">The House of ESSCERA</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A legacy of excellence, innovation, and uncompromising dedication to the art of perfumery.
            </p>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">A Century of Excellence</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Founded in 1924 in the heart of Paris, ESSCERA began as a small atelier dedicated to creating
                    bespoke fragrances for the European aristocracy. Our founder, Maison Laurent, believed that scent
                    was the ultimate expression of one&apos;s identity.
                  </p>
                  <p>
                    Over the decades, we have remained true to this philosophy, crafting each fragrance with the same
                    passion and attention to detail that defined our earliest creations. Our master perfumers travel the
                    world in search of the rarest ingredients, from Bulgarian rose fields to the sandalwood forests of
                    Mysore.
                  </p>
                  <p>
                    Today, ESSCERA stands as a testament to timeless elegance, serving discerning clients across 30
                    countries who appreciate the art of true luxury perfumery.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-4/5 relative rounded-lg overflow-hidden">
                  <Image src="/vintage-perfume-laboratory-with-gold-accents.jpg" alt="ESSCERA heritage" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-24 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-4">Our Values</p>
              <h2 className="text-3xl font-bold text-foreground">The Pillars of Excellence</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: "Quality",
                  description:
                    "Only the finest raw materials make it into our fragrances. We accept nothing less than perfection.",
                },
                {
                  title: "Craftsmanship",
                  description: "Each bottle is the result of meticulous handwork, from formulation to finishing.",
                },
                {
                  title: "Sustainability",
                  description: "We are committed to ethical sourcing and environmentally responsible practices.",
                },
              ].map((value) => (
                <div key={value.title} className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#D4AF37] flex items-center justify-center">
                    <span className="gold-text text-2xl font-bold">{value.title[0]}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
