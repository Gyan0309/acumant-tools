"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  BarChart3,
  Code,
  Image,
  MessageSquare,
  FileSearch,
  Sparkles,
  Zap,
  Lightbulb,
  PenTool,
  Layers,
  Workflow,
} from "lucide-react"
import Link from "next/link"

export function AIToolIdeas() {
  const [activeTab, setActiveTab] = useState("all")

  const categories = [
    { id: "all", name: "All Tools" },
    { id: "content", name: "Content Creation" },
    { id: "data", name: "Data Analysis" },
    { id: "dev", name: "Development" },
    { id: "business", name: "Business" },
  ]

  const tools = [
    {
      id: "content-generator",
      name: "AI Content Generator",
      description: "Create high-quality blog posts, articles, and marketing copy with advanced AI assistance.",
      category: "content",
      features: ["SEO optimization", "Multiple tones", "Multilingual support"],
      icon: <FileText className="h-6 w-6 text-brand-teal" />,
      new: true,
    },
    {
      id: "data-insights",
      name: "Data Insights Engine",
      description: "Extract meaningful insights from complex datasets with AI-powered analysis.",
      category: "data",
      features: ["Pattern recognition", "Predictive analytics", "Visual reports"],
      icon: <BarChart3 className="h-6 w-6 text-brand-blue" />,
    },
    {
      id: "code-assistant",
      name: "AI Code Assistant",
      description: "Accelerate development with AI-powered code suggestions, debugging, and optimization.",
      category: "dev",
      features: ["Multi-language support", "Code refactoring", "Documentation generation"],
      icon: <Code className="h-6 w-6 text-brand-teal" />,
      new: true,
    },
    {
      id: "image-generator",
      name: "AI Image Creator",
      description: "Generate custom images, graphics, and visual assets for your projects.",
      category: "content",
      features: ["Custom styles", "Brand alignment", "Batch processing"],
      icon: <Image className="h-6 w-6 text-brand-blue" />,
    },
    {
      id: "chatbot-builder",
      name: "Custom Chatbot Builder",
      description: "Create and deploy AI chatbots trained on your business data and processes.",
      category: "business",
      features: ["Knowledge base integration", "Conversation flows", "Multi-platform deployment"],
      icon: <MessageSquare className="h-6 w-6 text-brand-teal" />,
    },
    {
      id: "document-analyzer",
      name: "Document Intelligence",
      description: "Extract, summarize, and analyze information from documents, contracts, and forms.",
      category: "business",
      features: ["OCR capabilities", "Legal document analysis", "Compliance checking"],
      icon: <FileSearch className="h-6 w-6 text-brand-blue" />,
      new: true,
    },
    {
      id: "sentiment-analyzer",
      name: "Sentiment Analysis",
      description: "Monitor and analyze customer sentiment across reviews, social media, and feedback.",
      category: "business",
      features: ["Real-time monitoring", "Trend analysis", "Competitor comparison"],
      icon: <Sparkles className="h-6 w-6 text-brand-teal" />,
    },
    {
      id: "api-generator",
      name: "API Generator",
      description: "Generate APIs from natural language descriptions or existing data models.",
      category: "dev",
      features: ["OpenAPI specification", "Authentication setup", "Documentation"],
      icon: <Zap className="h-6 w-6 text-brand-blue" />,
    },
    {
      id: "idea-generator",
      name: "Innovation Assistant",
      description: "Generate creative ideas, solutions, and strategies for business challenges.",
      category: "business",
      features: ["Brainstorming tools", "Market trend analysis", "Competitive insights"],
      icon: <Lightbulb className="h-6 w-6 text-brand-teal" />,
      new: true,
    },
    {
      id: "content-optimizer",
      name: "Content Optimizer",
      description: "Analyze and enhance existing content for better engagement and SEO performance.",
      category: "content",
      features: ["Readability analysis", "SEO recommendations", "Engagement metrics"],
      icon: <PenTool className="h-6 w-6 text-brand-blue" />,
    },
    {
      id: "data-visualizer",
      name: "AI Data Visualizer",
      description: "Transform complex data into intuitive, interactive visualizations.",
      category: "data",
      features: ["Custom chart types", "Interactive dashboards", "Automated insights"],
      icon: <Layers className="h-6 w-6 text-brand-teal" />,
    },
    {
      id: "workflow-automator",
      name: "Workflow Automator",
      description: "Create intelligent automation workflows powered by AI decision-making.",
      category: "business",
      features: ["Visual workflow builder", "Integration with popular tools", "Conditional logic"],
      icon: <Workflow className="h-6 w-6 text-brand-blue" />,
      new: true,
    },
  ]

  const filteredTools = activeTab === "all" ? tools : tools.filter((tool) => tool.category === activeTab)

  return (
    <div className="container py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-teal to-brand-blue bg-clip-text text-transparent">
          Enhance Your Productivity with AI
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Discover our growing collection of AI-powered tools designed to transform your workflow and boost efficiency.
        </p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-1">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-teal/10 data-[state=active]:to-brand-blue/10"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <Card
                key={tool.id}
                className="overflow-hidden border border-brand-teal/10 hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-md bg-gradient-to-br from-brand-teal/10 to-brand-blue/10 flex items-center justify-center">
                      {tool.icon}
                    </div>
                    {tool.new && (
                      <Badge
                        variant="outline"
                        className="bg-gradient-to-r from-brand-teal to-brand-blue text-white border-0"
                      >
                        New
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-4 text-xl">{tool.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex flex-wrap gap-2">
                    {tool.features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-brand-teal/5 text-brand-teal border-brand-teal/20"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-brand-teal/20 hover:bg-brand-teal/5 hover:text-brand-teal"
                    asChild
                  >
                    <Link href={`/tools/${tool.id}`}>Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold mb-4">Need a Custom AI Solution?</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Our team can build tailored AI tools specific to your business needs and workflows.
        </p>
        <Button className="bg-gradient-to-r from-brand-teal to-brand-blue hover:from-brand-teal/90 hover:to-brand-blue/90 text-white">
          Contact Our AI Experts
        </Button>
      </div>
    </div>
  )
}

