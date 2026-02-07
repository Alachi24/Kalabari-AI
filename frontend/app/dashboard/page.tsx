'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCurrentUser, signOut } from '@/lib/actions/auth'
import { Globe, LogOut, Home, Copy, Trash2 } from 'lucide-react'

interface User {
  id: string
  email: string
}

interface Translation {
  id: string
  source_text: string
  translated_text: string
  source_language: string
  target_language: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [translations, setTranslations] = useState<Translation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingHistory, setIsFetchingHistory] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/auth/login')
        } else {
          setUser({
            id: currentUser.id,
            email: currentUser.email || '',
          })
          // Fetch translation history
          fetchTranslationHistory()
        }
      } catch (error) {
        console.error('[v0] Auth check error:', error)
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const fetchTranslationHistory = async () => {
    setIsFetchingHistory(true)
    try {
      const response = await fetch('/api/translations/history?limit=10&offset=0')
      if (response.ok) {
        const data = await response.json()
        setTranslations(data.translations)
      } else {
        console.error('[v0] Failed to fetch history')
      }
    } catch (error) {
      console.error('[v0] Fetch error:', error)
    } finally {
      setIsFetchingHistory(false)
    }
  }

  const handleCopyTranslation = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard')
    } catch (error) {
      console.error('[v0] Copy error:', error)
    }
  }

  const handleDeleteTranslation = async (id: string) => {
    if (confirm('Delete this translation?')) {
      try {
        const response = await fetch(`/api/translations/delete/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setTranslations(translations.filter((t) => t.id !== id))
          alert('Translation deleted')
        }
      } catch (error) {
        console.error('[v0] Delete error:', error)
      }
    }
  }

  const handleSignOut = async () => {
    try {
      const result = await signOut()
      if (result.success) {
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('[v0] Sign out error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">LinguaAI</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-foreground">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-foreground"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="md:col-span-3">
            <div className="bg-card border border-border rounded-2xl p-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {user?.email?.split('@')[0]}!
              </h1>
              <p className="text-muted-foreground">
                Continue translating or explore your translation history and saved translations.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Translations Today
            </div>
            <div className="text-3xl font-bold text-foreground">
              {translations.filter((t) => {
                const today = new Date().toDateString()
                return new Date(t.created_at).toDateString() === today
              }).length}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Total Translations
            </div>
            <div className="text-3xl font-bold text-foreground">{translations.length}</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Languages Used
            </div>
            <div className="text-3xl font-bold text-foreground">
              {new Set(translations.map((t) => t.target_language)).size}
            </div>
          </div>

          {/* Recent Translations Section */}
          <div className="md:col-span-3">
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">Recent Translations</h2>
                {isFetchingHistory && <span className="text-xs text-muted-foreground">Loading...</span>}
              </div>

              {translations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No translations yet</p>
                  <Link href="/">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Start Translating
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {translations.map((translation) => (
                    <div
                      key={translation.id}
                      className="border border-border rounded-lg p-4 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground mb-2">
                            {translation.source_language.toUpperCase()} → {translation.target_language.toUpperCase()}
                          </div>
                          <p className="text-sm text-foreground mb-2">
                            <span className="font-medium">Original:</span> {translation.source_text}
                          </p>
                          <p className="text-sm text-foreground">
                            <span className="font-medium">Translation:</span> {translation.translated_text}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(translation.created_at).toLocaleDateString()} {new Date(translation.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleCopyTranslation(translation.translated_text)}
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteTranslation(translation.id)}
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
