import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AIToolIdeas } from "@/components/tools/ai-tool-ideas"

export default async function ToolsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />
      <main className="flex-1">
        <AIToolIdeas />
      </main>
    </div>
  )
}

