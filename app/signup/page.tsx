"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { signup } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    const result = await signup(formData.email, formData.username, formData.password)

    if (result.success) {
      toast({
        title: "Account created",
        description: "Welcome to esscera!",
      })
      router.push("/login")
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create account.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div
        className="hidden lg:block flex-1 bg-cover bg-center"
        style={{
          backgroundImage: `url('/perfume3.WEBP')`,
        }}
      >
        <div className="w-full h-full bg-linear-to-l from-background to-transparent" />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block mb-8">
              <span className="text-4xl font-bold tracking-wider capitalize text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-amber-400">
                esscera
              </span>
            </Link>
            <h1 className="text-2xl font-bold tracking-wider capitalize text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-amber-400">Create Account</h1>
            <p className="text-muted-foreground mt-2">Join our exclusive community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                required
                className="bg-secondary border-border focus:border-[#D4AF37] focus:ring-[#D4AF37] py-6"
                placeholder="Choose a username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
                className="bg-secondary border-border focus:border-[#D4AF37] focus:ring-[#D4AF37] py-6"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                  className="bg-secondary border-border focus:border-[#D4AF37] focus:ring-[#D4AF37] py-6 pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
                className="bg-secondary border-border focus:border-[#D4AF37] focus:ring-[#D4AF37] py-6"
                placeholder="Confirm your password"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-purple-400 to-amber-400 text-primary-foreground py-6 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link href="/login" className=" font-bold tracking-wider capitalize text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-amber-400 hover:underline">
                Sign in
              </Link>
            </p>
            <Link href="/" className="text-sm text-muted-foreground hover:text-[#D4AF37] transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
