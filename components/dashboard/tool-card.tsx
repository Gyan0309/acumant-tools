import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, Database, Search, Package, ArrowRight, Bot } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ToolCardProps {
  tool: {
    id: string
    name: string
    description: string
    slug: string
    icon?: string
  }
}

export function ToolCard({ tool }: ToolCardProps) {
  const getToolIcon = (slug: string) => {
    switch (slug) {
      case "chat":
        return <MessageSquare className="h-5 w-5" />
      case "data-formulator":
        return <Database className="h-5 w-5" />
      case "deep-research":
        return <Search className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getToolColor = (slug: string) => {
    switch (slug) {
      case "chat":
        return "bg-gradient-to-br from-brand-teal/20 to-brand-blue/20 text-brand-teal dark:from-brand-teal/30 dark:to-brand-blue/30 dark:text-brand-teal"
      case "data-formulator":
        return "bg-gradient-to-br from-brand-teal/20 to-brand-blue/20 text-brand-teal dark:from-brand-teal/30 dark:to-brand-blue/30 dark:text-brand-teal"
      case "deep-research":
        return "bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 text-brand-blue dark:from-brand-blue/30 dark:to-brand-purple/30 dark:text-brand-blue"
      default:
        return "bg-gradient-to-br from-brand-teal/20 to-brand-blue/20 text-brand-teal dark:from-brand-teal/30 dark:to-brand-blue/30 dark:text-brand-teal"
    }
  }

  const getToolBadge = (slug: string) => {
    switch (slug) {
      case "chat":
        return (
          <Badge
            variant="outline"
            className="bg-brand-teal/10 text-brand-teal dark:bg-brand-teal/20 dark:text-brand-teal"
          >
            GPT-4o
          </Badge>
        )
      case "data-formulator":
        return (
          <Badge
            variant="outline"
            className="bg-brand-teal/10 text-brand-teal dark:bg-brand-teal/20 dark:text-brand-teal"
          >
            Advanced
          </Badge>
        )
      case "deep-research":
        return (
          <Badge
            variant="outline"
            className="bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-brand-blue"
          >
            Research
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="bg-brand-teal/10 text-brand-teal dark:bg-brand-teal/20 dark:text-brand-teal"
          >
            AI-Powered
          </Badge>
        )
    }
  }

  const getToolFeatures = (slug: string) => {
    switch (slug) {
      case "chat":
        return ["Conversational AI", "Context awareness", "Knowledge retrieval"]
      case "data-formulator":
        return ["Data transformation", "Pattern recognition", "Visualization"]
      case "deep-research":
        return ["Comprehensive research", "Source verification", "Detailed reports"]
      default:
        return ["AI-powered analysis", "Automated processing", "Intelligent insights"]
    }
  }

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${getToolColor(tool.slug)}`}>{getToolIcon(tool.slug)}</div>
            <div>
              <CardTitle className="text-base">{tool.name}</CardTitle>
              <CardDescription className="line-clamp-1 text-xs">{tool.description}</CardDescription>
            </div>
          </div>
          {getToolBadge(tool.slug)}
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground p-4 pt-0">
        <p className="line-clamp-2 mb-2">{tool.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {getToolFeatures(tool.slug).map((feature, index) => (
            <div
              key={index}
              className="flex items-center text-xs bg-brand-teal/5 dark:bg-brand-teal/10 px-2 py-0.5 rounded-full"
            >
              <Bot className="h-3 w-3 mr-1 text-brand-teal" />
              {feature}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-1">
        <Button
          asChild
          className="w-full bg-gradient-to-r from-brand-teal to-brand-blue hover:from-brand-teal/90 hover:to-brand-blue/90 text-white border-0 shadow-sm hover:shadow-glow"
        >
          <Link href={`/tools/${tool.slug}`} className="flex items-center justify-center">
            Launch Tool
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

