"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ShoppingBag, Menu, User, LogOut } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const { totalItems } = useCart()
  const { user, isAdmin, logout } = useAuth()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })
    router.push("/")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-purple-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-wider capitalize text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-amber-400">
              esscera
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-widest uppercase text-muted-foreground hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r hover:from-purple-400 hover:to-amber-400 transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-purple-400 transition-colors duration-300"
                  >
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-md border-purple-400/20">
                  <DropdownMenuLabel className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-amber-400">
                    {user.name || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-purple-400/20" />
                  <DropdownMenuItem asChild>
                    <Link href={isAdmin ? "/admin" : "/account"} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {isAdmin ? "Admin Dashboard" : "My Account"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-400/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-purple-400 transition-colors duration-300"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Login</span>
                </Button>
              </Link>
            )}

            <Link href="/cart" className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-purple-400 transition-colors duration-300"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Button>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-linear-to-r from-purple-600 to-amber-500 text-white text-xs flex items-center justify-center font-medium shadow-lg shadow-purple-500/50">
                  {totalItems}
                </span>
              )}
            </Link>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-purple-400">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background/95 backdrop-blur-md border-purple-400/20">
                <div className="flex flex-col gap-8 mt-8">
                  {user && (
                    <>
                      <div className="pb-4 border-b border-purple-400/20">
                        <p className="text-sm text-muted-foreground mb-1">Welcome,</p>
                        <p className="text-lg font-medium text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-amber-400">
                          {user.name || user.email}
                        </p>
                      </div>
                    </>
                  )}
                  
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg tracking-widest uppercase text-foreground hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r hover:from-purple-400 hover:to-amber-400 transition-all"
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                  {user && (
                    <>
                      <Link
                        href={isAdmin ? "/admin" : "/account"}
                        onClick={() => setIsOpen(false)}
                        className="text-lg tracking-widest uppercase text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-amber-400"
                      >
                        {isAdmin ? "Admin" : "Account"}
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        className="text-lg tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors text-left"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}