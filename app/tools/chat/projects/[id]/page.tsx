"use client"

import { useEffect } from "react"
import { ProjectView } from "@/components/projects/project-view"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { use } from "react"

export default function ProjectDetailPage({ params }: { params: Promise< { id: string }> }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  // Unwrap params using React.use() to fix the deprecation warning
  const {id} = use(params)

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

      <main className="flex-1 container pasdy-10">
        <ProjectView projectId={id} />
      </main>
    </div>
  )
}

