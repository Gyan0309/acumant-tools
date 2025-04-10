"use client";

import type React from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserTools } from "@/lib/data";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getCurrentUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  MessageSquare,
  Database,
  Search,
  Sparkles,
  Bot,
  Zap,
  Shield,
  Users,
  BarChart3,
  Clock,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tools, setTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    projectsCompleted: 24,
    tokensUsed: "1.2M",
    timesSaved: "18h",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await getCurrentUser();
        if (!userData) {
          router.push("/login");
          return;
        }

        setUser(userData);
        const userTools = await getUserTools(userData.id);
        setTools(userTools);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/20 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const toolIcons: Record<string, React.ReactNode> = {
    chat: <MessageSquare className="h-6 w-6" />,
    "data-formulator": <Database className="h-6 w-6" />,
    "deep-research": <Search className="h-6 w-6" />,
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] dark:bg-[#0d1117]">
      <DashboardHeader user={user} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-teal/5 to-brand-blue/5 dark:from-brand-teal/10 dark:to-brand-blue/10 py-12 border-b border-brand-teal/10 dark:border-brand-teal/20">
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge
                  variant="outline"
                  className="mb-4 bg-white dark:bg-gray-800 shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 text-brand-teal" />
                  Enterprise AI Platform
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Welcome back,{" "}
                  <span className="text-brand-teal">
                    {user.name.split(" ")[0]}
                  </span>
                </h1>
                <p className="text-muted-foreground mb-6">
                  Access your enterprise-grade AI tools designed to enhance
                  productivity and drive innovation
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-brand-teal to-brand-blue text-white shadow-md hover:shadow-glow"
                  >
                    <Link
                      href={tools[0]?.slug ? `/tools/${tools[0].slug}` : "#"}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="shadow-sm">
                    <Lightbulb className="mr-2 h-4 w-4 text-brand-teal" />
                    Explore Features
                  </Button>
                </div>
              </div>
              <div className="hidden md:flex justify-end">
                <div className="relative w-full max-w-md h-64">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-teal/20 to-brand-blue/20 rounded-2xl transform rotate-3 animate-float"></div>
                  <div className="absolute top-4 right-4 w-64 h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center text-white">
                          <Bot className="h-5 w-5" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">AI Assistant</h3>
                          <p className="text-xs text-muted-foreground">
                            Ready to help
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-muted/50 p-2 rounded-lg text-xs">
                          How can I help you today?
                        </div>
                        <div className="bg-primary/10 p-2 rounded-lg text-xs ml-auto max-w-[80%]">
                          I need to analyze our quarterly sales data
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-xs text-muted-foreground">
                        Powered by GPT-4o
                      </div>
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-gradient-to-r from-brand-teal to-brand-blue text-white"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-teal/5 to-transparent dark:from-brand-teal/10 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-brand-blue/5 to-transparent dark:from-brand-blue/10 -z-10"></div>
        </section>

        {/* Stats Section */}
        <section className="py-8 bg-white dark:bg-gray-800 border-b">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center p-4 rounded-xl bg-gradient-to-r from-brand-teal/5 to-brand-blue/5 dark:from-brand-teal/10 dark:to-brand-blue/10 border border-brand-teal/10 dark:border-brand-teal/20">
                <div className="p-3 rounded-full bg-brand-teal/10 dark:bg-brand-teal/20 mr-4">
                  <CheckCircle2 className="h-6 w-6 text-brand-teal" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Projects Completed
                  </p>
                  <h3 className="text-2xl font-bold">
                    {stats.projectsCompleted}
                  </h3>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-xl bg-gradient-to-r from-brand-blue/5 to-brand-purple/5 dark:from-brand-blue/10 dark:to-brand-purple/10 border border-brand-blue/10 dark:border-brand-blue/20">
                <div className="p-3 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 mr-4">
                  <TrendingUp className="h-6 w-6 text-brand-blue" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tokens Used</p>
                  <h3 className="text-2xl font-bold">{stats.tokensUsed}</h3>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-xl bg-gradient-to-r from-brand-purple/5 to-brand-teal/5 dark:from-brand-purple/10 dark:to-brand-teal/10 border border-brand-purple/10 dark:border-brand-purple/20">
                <div className="p-3 rounded-full bg-brand-purple/10 dark:bg-brand-purple/20 mr-4">
                  <Clock className="h-6 w-6 text-brand-purple" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Saved</p>
                  <h3 className="text-2xl font-bold">{stats.timesSaved}</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-12 bg-[#f8f9fc] dark:bg-[#0d1117]">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold">Your AI Tools</h2>
                <p className="text-muted-foreground">
                  Powerful tools to enhance your workflow
                </p>
              </div>
              <Button variant="outline" className="shadow-sm">
                View All Tools
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tools.map((tool) => (
                <Card
                  key={tool.id}
                  className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-[#1e293b] rounded-xl group"
                >
                  <div className="h-1.5 bg-gradient-to-r from-brand-teal to-brand-blue"></div>
                  <CardHeader className="pb-2 pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-brand-teal/10 to-brand-blue/10 dark:from-brand-teal/20 dark:to-brand-blue/20 group-hover:from-brand-teal/20 group-hover:to-brand-blue/20 dark:group-hover:from-brand-teal/30 dark:group-hover:to-brand-blue/30 transition-all duration-300">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center text-white">
                          {toolIcons[tool.slug] || <Bot className="h-5 w-5" />}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-xl text-[#1e293b] dark:text-white">
                          {tool.name}
                        </CardTitle>
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
                          <Layers className="h-3.5 w-3.5 text-brand-teal" />
                        </div>
                        <span className="text-sm text-[#475569] dark:text-[#cbd5e1]">
                          Seamless workflow integration
                        </span>
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
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="py-12 bg-white dark:bg-gray-800 border-t border-b border-muted">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold">Recent Activity</h2>
                <p className="text-muted-foreground">
                  Your latest projects and interactions
                </p>
              </div>
              <Button variant="outline" className="shadow-sm">
                View All Activity
              </Button>
            </div>

            <div className="space-y-4">
              {[
                {
                  tool: "Deep Research",
                  title: "Market Analysis Report",
                  date: "Today at 10:30 AM",
                  icon: <Search className="h-5 w-5 text-brand-blue" />,
                },
                {
                  tool: "Data Formulator",
                  title: "Q2 Sales Data Analysis",
                  date: "Yesterday at 3:15 PM",
                  icon: <Database className="h-5 w-5 text-brand-teal" />,
                },
                {
                  tool: "Chat",
                  title: "Product Strategy Discussion",
                  date: "Mar 20, 2025 at 11:45 AM",
                  icon: <MessageSquare className="h-5 w-5 text-brand-purple" />,
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 rounded-xl border bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-md transition-all duration-300"
                >
                  <div className="p-3 rounded-full bg-gradient-to-br from-brand-teal/10 to-brand-blue/10 dark:from-brand-teal/20 dark:to-brand-blue/20 mr-4">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{activity.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {activity.tool}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activity.date}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-[#f8f9fc] dark:bg-[#0d1117]">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-10">
              <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-teal/10 to-brand-blue/10 dark:from-brand-teal/20 dark:to-brand-blue/20 rounded-full mb-2">
                <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-brand-blue">
                  Platform Features
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-[#1e293b] dark:text-white">
                Enterprise-Ready Platform
              </h2>
              <p className="text-[#475569] dark:text-[#94a3b8] max-w-2xl mx-auto">
                Built with security, scalability, and performance at its core
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Enterprise Security",
                  description:
                    "Bank-grade security with end-to-end encryption and compliance with industry standards",
                  icon: <Shield className="h-5 w-5" />,
                },
                {
                  title: "Seamless Integration",
                  description:
                    "Connect with your existing tools and workflows through our comprehensive API",
                  icon: <Zap className="h-5 w-5" />,
                },
                {
                  title: "Advanced Analytics",
                  description:
                    "Gain insights into usage patterns and performance metrics across your organization",
                  icon: <BarChart3 className="h-5 w-5" />,
                },
                {
                  title: "Customizable Workflows",
                  description:
                    "Tailor the platform to your specific needs with customizable workflows and settings",
                  icon: <Sparkles className="h-5 w-5" />,
                },
                {
                  title: "Team Collaboration",
                  description:
                    "Work together seamlessly with shared projects, comments, and real-time updates",
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
                  className="bg-white dark:bg-[#1e293b] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border-0 group hover:bg-gradient-to-r hover:from-white hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-900"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-teal/10 to-brand-blue/10 dark:from-brand-teal/20 dark:to-brand-blue/20 flex items-center justify-center group-hover:from-brand-teal/20 group-hover:to-brand-blue/20 dark:group-hover:from-brand-teal/30 dark:group-hover:to-brand-blue/30 transition-all duration-300">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-medium mb-1 text-[#1e293b] dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-[#64748b] dark:text-[#94a3b8] text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-brand-teal/10 to-brand-blue/10 dark:from-brand-teal/20 dark:to-brand-blue/20 border-t border-brand-teal/10 dark:border-brand-teal/20">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to boost your productivity?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore all the AI-powered tools available to you and transform
              your workflow today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-gradient-to-r from-brand-teal to-brand-blue text-white shadow-md hover:shadow-glow">
                Explore All Tools
              </Button>
              <Button variant="outline" className="shadow-sm">
                View Documentation
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
