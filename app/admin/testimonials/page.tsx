"use client"

import React, { useEffect, useState } from "react"
import { Search, RefreshCw, CheckCircle, Clock, Trash2, Eye, EyeOff } from "lucide-react"

type Testimonial = {
  id: string
  quote: string
  author: string
  title: string
  rating: number
  approved: boolean
  createdAt: string
}

export default function AdminTestimonialsPanel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchList()
  }, [])

  const fetchList = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/testimonials?includeUnapproved=true")
      if (!res.ok) throw new Error("Failed to load testimonials")
      const data = await res.json()
      setTestimonials(data.testimonials || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const updateApproval = async (id: string, approved: boolean) => {
    setBusyId(id)
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, approved }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to update testimonial")
      }
      const updated = await res.json()
      setTestimonials((prev) => prev.map((t) => (t.id === id ? updated.testimonial : t)))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error")
    } finally {
      setBusyId(null)
    }
  }

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Delete this testimonial? This cannot be undone.")) return
    setBusyId(id)
    try {
      const res = await fetch(`/api/admin/testimonials?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Delete failed")
      }
      setTestimonials((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error")
    } finally {
      setBusyId(null)
    }
  }

  const filtered = testimonials.filter((t) => {
    const matchesFilter =
      filter === "all" ? true : filter === "approved" ? t.approved : !t.approved
    const matchesSearch =
      searchTerm === "" ||
      t.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: testimonials.length,
    approved: testimonials.filter((t) => t.approved).length,
    pending: testimonials.filter((t) => !t.approved).length,
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-3">
        <header className="mb-8">
          <div className="block items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-white mb-2">Testimonials Management</h1>
              <p className="text-slate-400">Review and manage customer testimonials</p>
            </div>
            <button
              onClick={fetchList}
              disabled={loading}
              className="flex w-full mt-4 items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-900 rounded-xl p-5 shadow-lg border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Total</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 shadow-lg border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Approved</p>
                  <p className="text-3xl font-bold text-emerald-400">{stats.approved}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 shadow-lg border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-amber-400">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-5 shadow-lg border border-slate-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    filter === "all"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("approved")}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    filter === "approved"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    filter === "pending"
                      ? "bg-amber-600 text-white shadow-md"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="bg-slate-900 rounded-xl p-12 shadow-lg border border-slate-800">
            <div className="flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mb-4" />
              <p className="text-slate-400">Loading testimonials...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-950 border border-red-800 rounded-xl p-6">
            <p className="text-red-200 font-medium">{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.length === 0 && (
              <div className="bg-slate-900 rounded-xl p-12 shadow-lg border border-slate-800">
                <div className="text-center">
                  <EyeOff className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-300 text-lg">No testimonials found</p>
                  <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search term</p>
                </div>
              </div>
            )}

            {filtered.map((t) => (
              <article
                key={t.id}
                className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{t.author}</h3>
                          {t.approved ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle className="w-3 h-3" />
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{t.title}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={i < t.rating ? "text-yellow-400" : "text-slate-700"}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span>•</span>
                          <span>{new Date(t.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}</span>
                        </div>
                      </div>
                    </div>

                    <blockquote className="text-slate-300 leading-relaxed border-l-4 border-blue-500 pl-4 py-1">
                      "{t.quote}"
                    </blockquote>
                  </div>

                  <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                    {!t.approved ? (
                      <button
                        disabled={busyId === t.id}
                        onClick={() => updateApproval(t.id, true)}
                        className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {busyId === t.id ? "Processing..." : "Approve"}
                      </button>
                    ) : (
                      <button
                        disabled={busyId === t.id}
                        onClick={() => updateApproval(t.id, false)}
                        className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <EyeOff className="w-4 h-4" />
                        {busyId === t.id ? "Processing..." : "Unapprove"}
                      </button>
                    )}

                    <button
                      disabled={busyId === t.id}
                      onClick={() => deleteTestimonial(t.id)}
                      className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}