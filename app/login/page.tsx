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

export default function LoginPage() {
  const router = useRouter()
  const { login, isAdmin } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const success = await login(formData.username, formData.password)

    if (success) {
      const redirectPath = isAdmin ? "/admin" : "/shop"
      const redirectMessage = isAdmin ? "Admin Dashboard" : "Shop"

      toast({
        title: "Welcome back",
        description: `You have been signed in successfully. Navigating to ${redirectMessage}...`,
      })

      setTimeout(() => {
        router.push(redirectPath)
        router.refresh()
      }, 1500)
    } else {
      toast({
        title: "Error",
        description: "Invalid username or password.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="inline-block mb-8">
              <span className="text-4xl font-bold tracking-wider capitalize text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-amber-400">
                esscera
              </span>
            </Link>
            <h1 className="text-2xl font-bold tracking-wider capitalize text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-amber-400">
              Welcome Back
            </h1>
            <p className="text-muted-foreground mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Username or Email
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                required
                className="bg-secondary border-border focus:border-purple-400 focus:ring-purple-400 py-6"
                placeholder="Enter your username or email"
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
                  className="bg-secondary border-border focus:border-purple-400 focus:ring-purple-400 py-6 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-purple-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white py-6 text-sm tracking-widest uppercase shadow-lg shadow-purple-500/50 transition-all duration-300"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-muted-foreground text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-amber-400 hover:from-purple-500 hover:to-amber-500 transition-all"
              >
                Create one
              </Link>
            </p>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r hover:from-purple-400 hover:to-amber-400 transition-all"
            >
              Return to Home
            </Link>
          </div>

          <div className="mt-8 p-4 bg-secondary rounded-lg border border-purple-400/20">
            <p className="text-xs text-muted-foreground text-center">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-amber-400 font-semibold">
                Demo Admin:
              </span>{" "}
              Run the seed script first, then use admin / admin123
            </p>
          </div>
        </div>
      </div>

      <div
        className="hidden lg:block flex-1 bg-cover bg-center relative"
        style={{
          backgroundImage: `url('perfume3.WEBP')`,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/50 to-transparent" />
      </div>
    </div>
  )
}