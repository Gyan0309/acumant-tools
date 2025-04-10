"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
// import { EmbeddedGPTResearch } from "@/components/tools/embedded-gpt-research"
import { Researcher } from "@/components/tools/researcher"

export default function DeepResearchPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

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
    const preserveScrollEvent = new CustomEvent("preserveScroll:deepResearch")
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
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader user={user} />
      <main className="flex-1 p-0">
        {/* <EmbeddedGPTResearch /> */}
        <Researcher />

      </main>
    </div>
  )
}

