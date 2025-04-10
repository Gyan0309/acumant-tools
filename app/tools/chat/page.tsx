// Change from server component to client component
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedChatInterface } from "@/components/tools/enhanced-chat-interface"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function ChatPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user data and prevent scroll
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await getCurrentUser()
        if (!userData) {
          router.push("/login")
          return
        }

        setUser(userData)
      } catch (error) {
        console.error("Failed to load user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Create a custom event for this specific page
    const preserveScrollEvent = new CustomEvent("preserveScroll:chat")
    document.dispatchEvent(preserveScrollEvent)

    // Prevent scroll to top on navigation using multiple techniques
    const scrollPosition = sessionStorage.getItem("scrollPosition")
    if (scrollPosition) {
      // Use requestAnimationFrame for smoother scroll restoration
      requestAnimationFrame(() => {
        window.scrollTo(0, Number.parseInt(scrollPosition, 10))

        // Add a backup in case the first attempt fails
        requestAnimationFrame(() => {
          window.scrollTo(0, Number.parseInt(scrollPosition, 10))
        })
      })
    }

    // Return cleanup function
    return () => {
      // Save position when leaving the page
      sessionStorage.setItem("scrollPosition", window.scrollY.toString())
    }
  }, [router])

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/20 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />

      <main className="flex-1 container py-10">
        <h1 className="text-3xl font-bold mb-6">Chat Tool</h1>

        <Card>
          <CardHeader>
            <CardTitle>AI Chat Assistant</CardTitle>
            <CardDescription>
              Toggle between project-based chat and external AI models to get the assistance you need
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <EnhancedChatInterface />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

