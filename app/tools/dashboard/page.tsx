"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserTools } from "@/lib/data"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { getCurrentUser } from "@/lib/auth"
import { useEffect, useState } from "react"
import { ArrowRight, MessageSquare, Database, Search, Sparkles, Bot, Zap, Shield, Users, BarChart3 } from "lucide-react"

// Let's simplify the home page structure to avoid potential React fiber issues
export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tools, setTools] = useState<any[]>([])
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
        const userTools = await getUserTools(userData.id)
        setTools(userTools)
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

  const toolIcons: Record<string, React.ReactNode> = {
    chat: <MessageSquare className="h-6 w-6" />,
    "data-formulator": <Database className="h-6 w-6" />,
    "deep-research": <Search className="h-6 w-6" />,
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] dark:bg-[#0d1117]">
      <DashboardHeader user={user} />

      <main className="flex-1">
        {/* Tools Section */}
        <section className="py-10 container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4 text-[#1e293b] dark:text-white">
              Welcome to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-brand-blue">
                Acumant Tools
              </span>
            </h1>
            <p className="text-[#475569] dark:text-[#94a3b8] max-w-2xl mx-auto">
              Access your enterprise-grade AI tools designed to enhance productivity and drive innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <Card
                key={tool.id}
                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-[#1e293b] rounded-xl"
              >
                <div className="h-1.5 bg-gradient-to-r from-brand-teal to-brand-blue"></div>
                <CardHeader className="pb-2 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-brand-teal/10 to-brand-blue/10 dark:from-brand-teal/20 dark:to-brand-blue/20">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center text-white">
                        {toolIcons[tool.slug] || <Bot className="h-5 w-5" />}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl text-[#1e293b] dark:text-white">{tool.name}</CardTitle>
                      <CardDescription className="text-sm text-[#64748b] dark:text-[#94a3b8]">
                        {tool.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-teal/20 to-brand-blue/20 dark:from-brand-teal/30 dark:to-brand-blue/30 flex items-center justify-center">
                        <Zap className="h-3.5 w-3.5 text-brand-teal" />
                      </div>
                      <span className="text-sm text-[#475569] dark:text-[#cbd5e1]">
                        AI-powered analysis and insights
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-teal/20 to-brand-blue/20 dark:from-brand-teal/30 dark:to-brand-blue/30 flex items-center justify-center">
                        <Zap className="h-3.5 w-3.5 text-brand-teal" />
                      </div>
                      <span className="text-sm text-[#475569] dark:text-[#cbd5e1]">Seamless workflow integration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-teal/20 to-brand-blue/20 dark:from-brand-teal/30 dark:to-brand-blue/30 flex items-center justify-center">
                        <Zap className="h-3.5 w-3.5 text-brand-teal" />
                      </div>
                      <span className="text-sm text-[#475569] dark:text-[#cbd5e1]">Enterprise-grade security</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-6">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-brand-teal to-brand-blue hover:from-brand-teal/90 hover:to-brand-blue/90 text-white border-0 shadow-md hover:shadow-glow transition-all"
                  >
                    <Link href={`/tools/${tool.slug}`}>
                      Launch {tool.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-10 bg-white dark:bg-[#111827]">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-10">
              <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-teal/10 to-brand-blue/10 dark:from-brand-teal/20 dark:to-brand-blue/20 rounded-full mb-2">
                <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-brand-blue">
                  Platform Features
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-[#1e293b] dark:text-white">Enterprise-Ready Platform</h2>
              <p className="text-[#475569] dark:text-[#94a3b8] max-w-2xl mx-auto">
                Built with security, scalability, and performance at its core
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Enterprise Security",
                  description: "Bank-grade security with end-to-end encryption and compliance with industry standards",
                  icon: <Shield className="h-5 w-5" />,
                },
                {
                  title: "Seamless Integration",
                  description: "Connect with your existing tools and workflows through our comprehensive API",
                  icon: <Zap className="h-5 w-5" />,
                },
                {
                  title: "Advanced Analytics",
                  description: "Gain insights into usage patterns and performance metrics across your organization",
                  icon: <BarChart3 className="h-5 w-5" />,
                },
                {
                  title: "Customizable Workflows",
                  description: "Tailor the platform to your specific needs with customizable workflows and settings",
                  icon: <Sparkles className="h-5 w-5" />,
                },
                {
                  title: "Team Collaboration",
                  description: "Work together seamlessly with shared projects, comments, and real-time updates",
                  icon: <Users className="h-5 w-5" />,
                },
                {
                  title: "24/7 Support",
                  description:
                    "Get help when you need it with our dedicated support team and comprehensive documentation",
                  icon: <Bot className="h-5 w-5" />,
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-[#f8f9fc] dark:bg-[#1e293b] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-teal/10 to-brand-blue/10 dark:from-brand-teal/20 dark:to-brand-blue/20 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-medium mb-1 text-[#1e293b] dark:text-white">{feature.title}</h3>
                      <p className="text-[#64748b] dark:text-[#94a3b8] text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

