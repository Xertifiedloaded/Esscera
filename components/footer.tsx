import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-purple-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-wider capitalize text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">
                esscera
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Crafting exceptional fragrances since 1924. Each scent tells a story of elegance and refinement.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">
              Explore
            </h4>
            <ul className="space-y-3">
              {["Shop", "Testimonials", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-amber-400 transition-all duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">
              Service
            </h4>
            <ul className="space-y-3">
              {["Shipping", "Returns", "FAQ", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-amber-400 transition-all duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>12 Avenue Montaigne</p>
              <p>Paris 75008, France</p>
              <p>+33 1 42 68 00 00</p>
              <p>contact@esscera.com</p>
            </div>
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="text-muted-foreground hover:text-purple-400 transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-amber-400 transition-all duration-300 hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-purple-400 transition-all duration-300 hover:scale-110"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-purple-400/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Esscera. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-amber-400 transition-all duration-300"
              >
                Terms & Conditions
              </Link>
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-amber-400 transition-all duration-300"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}