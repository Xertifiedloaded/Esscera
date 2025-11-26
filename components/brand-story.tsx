import Image from "next/image"

export function BrandStory() {
  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-4/5 relative rounded-lg overflow-hidden">
              <Image src="/perfume3.WEBP" alt="Perfume" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 border-2 border-[#D4AF37] rounded-lg hidden lg:block" />
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase">Our Heritage</p>
              <h2 className="text-4xl font-bold text-foreground">A Century of Excellence</h2>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Early this year 2025, Esscera has been at the forefront of haute parfumerie, creating exceptional fragrances
                that transcend time and trends.
              </p>
              <p>
                Our master perfumers blend rare ingredients sourced from the most prestigious regions of the world,
                crafting scents that tell stories of elegance, passion, and sophistication.
              </p>
              <p>
                Each bottle is a testament to our unwavering commitment to quality and the artistry that has defined our
                maison for generations.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div className="text-center">
                <p className="text-3xl font-bold gold-text">1</p>
                <p className="text-sm text-muted-foreground mt-1">Year of Excellence</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold gold-text">3+</p>
                <p className="text-sm text-muted-foreground mt-1">Unique Fragrances</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold gold-text">5</p>
                <p className="text-sm text-muted-foreground mt-1">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
