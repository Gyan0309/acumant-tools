"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { getCurrentUser, isSuperAdmin, getAllTools } from "@/lib/data"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useRouter } from "next/navigation"
import { Loader2, MessageSquare, Database, Search, Code, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { JSX } from "react"

// Map tool slugs to icons
const toolIcons: Record<string, JSX.Element> = {
  chat: <MessageSquare className="h-5 w-5" />,
  "data-formulator": <Database className="h-5 w-5" />,
  "deep-research": <Search className="h-5 w-5" />,
  "ai-content-generator": <BarChart3 className="h-5 w-5" />,
  "data-insights-engine": <BarChart3 className="h-5 w-5" />,
  "ai-code-assistant": <Code className="h-5 w-5" />,
}

export default function ToolsManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [tools, setTools] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await getCurrentUser()
        if (!userData) {
          router.push("/login")
          return
        }

        // Only super admins can access this page
        if (!isSuperAdmin(userData)) {
          router.push("/dashboard")
          return
        }

        setUser(userData)

        const toolsData = await getAllTools()
        // Add some additional mock tools for the UI
        const extendedTools = [
          ...toolsData,
          {
            id: "4",
            name: "AI Content Generator",
            description: "Create high-quality blog posts, articles, and marketing copy with advanced AI technology",
            slug: "ai-content-generator",
            isActive: true,
          },
          {
            id: "5",
            name: "Data Insights Engine",
            description: "Extract meaningful insights from complex datasets with AI-powered analysis",
            slug: "data-insights-engine",
            isActive: true,
          },
          {
            id: "6",
            name: "AI Code Assistant",
            description: "Accelerate development with AI-powered code suggestions, debugging, and optimization",
            slug: "ai-code-assistant",
            isActive: true,
          },
        ]
        setTools(extendedTools)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleToolToggle = (toolId: string) => {
    setTools((prev) => prev.map((tool) => (tool.id === toolId ? { ...tool, isActive: !tool.isActive } : tool)))

    toast({
      title: "Tool status updated",
      description: `Tool has been ${tools.find((t) => t.id === toolId)?.isActive ? "disabled" : "enabled"}.`,
    })
  }

  const filteredTools =
    activeTab === "all"
      ? tools
      : tools.filter((tool) => {
          if (activeTab === "content" && ["ai-content-generator"].includes(tool.slug)) return true
          if (activeTab === "data" && ["data-formulator", "data-insights-engine"].includes(tool.slug)) return true
          if (activeTab === "development" && ["ai-code-assistant"].includes(tool.slug)) return true
          if (activeTab === "business" && ["chat", "deep-research"].includes(tool.slug)) return true
          return false
        })

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader user={user || {}} />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />

      <main className="flex-1 container py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-brand-blue">
            Tools Management
          </h1>
          <p className="text-muted-foreground mt-1">Enable or disable tools across the platform</p>
        </div>

        <div className="flex overflow-x-auto pb-2 mb-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Button variant={activeTab === "all" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("all")}>
              All Tools
            </Button>
            <Button
              variant={activeTab === "content" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("content")}
            >
              Content Creation
            </Button>
            <Button variant={activeTab === "data" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("data")}>
              Data Analysis
            </Button>
            <Button
              variant={activeTab === "development" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("development")}
            >
              Development
            </Button>
            <Button
              variant={activeTab === "business" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("business")}
            >
              Business
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-md bg-gradient-to-br from-brand-teal/10 to-brand-blue/10 dark:from-brand-teal/20 dark:to-brand-blue/20">
                      {toolIcons[tool.slug] || <MessageSquare className="h-5 w-5 text-brand-teal" />}
                    </div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </div>
                  <Switch checked={tool.isActive} onCheckedChange={() => handleToolToggle(tool.id)} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

