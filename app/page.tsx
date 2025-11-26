import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

import { FeaturedProducts } from "@/components/featured-products"
import { BrandStory } from "@/components/brand-story"
import { Testimonials } from "@/components/testimonials"
import { Newsletter } from "@/components/newsletter"
import HeroSection from "@/components/hero-section"


export default function HomePage() {
  return (
    <div className="min-h-screen font-(--font-montserrat) bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <Testimonials />
        <BrandStory />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
