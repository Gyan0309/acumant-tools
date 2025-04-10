"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Copy, ExternalLink, Check, Loader2, BookOpen, Globe, FileText } from "lucide-react"
import type { ResearchOptions } from "./deep-research-form"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface ResearchOutputProps {
  query: string
  options?: ResearchOptions
}

interface Source {
  id: number
  title: string
  url: string
  type: "web" | "academic" | "news" | "local"
  snippet: string
  relevance: "high" | "medium" | "low"
}

export function ResearchOutput({ query, options }: ResearchOutputProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState<string>("planning")
  const [agentThoughts, setAgentThoughts] = useState<string[]>([])
  const [researchReport, setResearchReport] = useState("")
  const [sources, setSources] = useState<Source[]>([])
  const [activeTab, setActiveTab] = useState("report")
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate the research process with multiple steps
    const runResearch = async () => {
      setIsLoading(true)
      setCurrentStep("planning")

      // Step 1: Planning
      setAgentThoughts([
        "I need to research about: " + query,
        "Breaking down this query into sub-questions to research thoroughly.",
        "Planning to search for recent and authoritative sources on this topic.",
      ])

      await new Promise((r) => setTimeout(r, 2000))

      // Step 2: Searching
      setCurrentStep("searching")
      setAgentThoughts((prev) => [
        ...prev,
        "Searching for information from multiple sources...",
        "Looking for academic papers on " + query,
        "Searching for recent news articles and web content",
        "Filtering out low-quality or irrelevant sources",
      ])

      await new Promise((r) => setTimeout(r, 3000))

      // Step 3: Analyzing
      setCurrentStep("analyzing")
      setAgentThoughts((prev) => [
        ...prev,
        "Analyzing information from collected sources",
        "Comparing different perspectives on " + query,
        "Identifying key insights and findings",
        "Evaluating the credibility of sources",
      ])

      await new Promise((r) => setTimeout(r, 3000))

      // Step 4: Generating report
      setCurrentStep("writing")
      setAgentThoughts((prev) => [
        ...prev,
        "Synthesizing information into a coherent report",
        "Organizing findings into logical sections",
        "Adding citations to original sources",
        "Finalizing report with executive summary and conclusions",
      ])

      // Generate mock sources
      const mockSources: Source[] = [
        {
          id: 1,
          title: `Recent Developments in ${query}`,
          url: "https://example.com/article1",
          type: "web",
          snippet: `This comprehensive article discusses the latest developments in ${query}, highlighting key trends and future directions.`,
          relevance: "high",
        },
        {
          id: 2,
          title: `${query}: A Systematic Review`,
          url: "https://academic-journal.org/review",
          type: "academic",
          snippet: `This peer-reviewed paper provides a systematic analysis of research on ${query} over the past decade.`,
          relevance: "high",
        },
        {
          id: 3,
          title: `The Impact of ${query} on Modern Society`,
          url: "https://news-site.com/impact-analysis",
          type: "news",
          snippet: `This news article examines how ${query} is affecting various aspects of contemporary society and business.`,
          relevance: "medium",
        },
        {
          id: 4,
          title: `Understanding the Fundamentals of ${query}`,
          url: "https://educational-site.org/fundamentals",
          type: "web",
          snippet: `This educational resource explains the core concepts and principles behind ${query} in an accessible manner.`,
          relevance: "medium",
        },
        {
          id: 5,
          title: `Case Studies in ${query}`,
          url: "https://research-institute.org/case-studies",
          type: "academic",
          snippet: `This collection of case studies provides real-world examples of ${query} in practice across different contexts.`,
          relevance: "high",
        },
      ]

      // Generate mock report based on the query
      const mockReport = `# Comprehensive Research Report: ${query}

## Executive Summary
This report presents a comprehensive analysis of ${query} based on extensive research from multiple authoritative sources. The findings indicate significant developments in this area with important implications for various stakeholders.

## Introduction
${query} has emerged as a critical area of interest across multiple domains. This research aims to provide a thorough understanding of the current state, key developments, and future directions related to this topic.

## Key Findings
1. **Current State of ${query}**: Analysis of recent data indicates that ${query} has evolved significantly over the past few years, with notable advancements in methodologies and applications.

2. **Major Trends**: Several trends have been identified in the development of ${query}, including increased integration with complementary technologies, growing adoption across industries, and enhanced performance metrics.

3. **Challenges and Limitations**: Despite progress, ${query} faces several challenges, including technical constraints, implementation barriers, and regulatory considerations that need to be addressed.

4. **Future Directions**: Based on current trajectories, ${query} is likely to continue evolving with potential breakthroughs in several areas, offering new opportunities and applications.

## Detailed Analysis

### Historical Context
The development of ${query} can be traced through several key phases:
- Early conceptualization and theoretical foundations
- Initial practical implementations and proof-of-concept demonstrations
- Mainstream adoption and integration into existing systems
- Current state of advanced applications and specialized use cases

### Technological Underpinnings
The technological infrastructure supporting ${query} consists of multiple components working in concert:
- Core algorithms and computational frameworks
- Data processing and management systems
- Integration mechanisms with existing technologies
- Performance optimization techniques

### Impact Assessment
The impact of ${query} spans multiple dimensions:
- Economic implications for industries and markets
- Social effects on communities and individuals
- Environmental considerations and sustainability factors
- Ethical and governance implications

## Conclusions
Based on comprehensive analysis, ${query} represents a significant area with substantial implications for various stakeholders. The research suggests that continued development in this field will likely yield important advances, while also requiring careful consideration of associated challenges.

## Recommendations
1. Further research into specific aspects of ${query} to address identified knowledge gaps
2. Development of frameworks for responsible implementation and governance
3. Exploration of potential applications in underserved domains
4. Collaborative approaches to addressing technical and practical challenges

## References
[1] Recent Developments in ${query}. (2023). Example.com.
[2] ${query}: A Systematic Review. (2023). Academic Journal of Research.
[3] The Impact of ${query} on Modern Society. (2023). News Site.
[4] Understanding the Fundamentals of ${query}. (2022). Educational Resource.
[5] Case Studies in ${query}. (2023). Research Institute Publications.`

      setSources(mockSources)
      setResearchReport(mockReport)

      await new Promise((r) => setTimeout(r, 2000))

      // Complete
      setCurrentStep("complete")
      setIsLoading(false)
    }

    runResearch()
  }, [query])

  const handleCopyReport = () => {
    navigator.clipboard.writeText(researchReport)
    setIsCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "Research report has been copied to your clipboard",
    })
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleDownloadReport = () => {
    const element = document.createElement("a")
    const file = new Blob([researchReport], { type: "text/markdown" })
    element.href = URL.createObjectURL(file)
    element.download = `research-report-${query
      .slice(0, 30)
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Report downloaded",
      description: "Research report has been downloaded as Markdown",
    })
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "academic":
        return <BookOpen className="h-4 w-4" />
      case "news":
        return <FileText className="h-4 w-4" />
      case "web":
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const getStepProgress = () => {
    switch (currentStep) {
      case "planning":
        return 10
      case "searching":
        return 30
      case "analyzing":
        return 60
      case "writing":
        return 90
      case "complete":
        return 100
      default:
        return 0
    }
  }

  return (
    <div className="space-y-8 mt-8">
      {isLoading ? (
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Research in Progress
            </CardTitle>
            <CardDescription>
              GPT Researcher is working on your query. This may take{" "}
              {options?.reportType === "brief" ? "2-3" : options?.reportType === "comprehensive" ? "5-7" : "10+"}{" "}
              minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${getStepProgress()}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "planning" ? "bg-primary text-primary-foreground animate-pulse" : currentStep === "complete" || currentStep === "writing" || currentStep === "analyzing" || currentStep === "searching" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {currentStep === "complete" ||
                    currentStep === "writing" ||
                    currentStep === "analyzing" ||
                    currentStep === "searching" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      1
                    )}
                  </div>
                  <span className="mt-1">Planning</span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "searching" ? "bg-primary text-primary-foreground animate-pulse" : currentStep === "complete" || currentStep === "writing" || currentStep === "analyzing" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {currentStep === "complete" || currentStep === "writing" || currentStep === "analyzing" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      2
                    )}
                  </div>
                  <span className="mt-1">Searching</span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "analyzing" ? "bg-primary text-primary-foreground animate-pulse" : currentStep === "complete" || currentStep === "writing" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {currentStep === "complete" || currentStep === "writing" ? <Check className="h-4 w-4" /> : 3}
                  </div>
                  <span className="mt-1">Analyzing</span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "writing" ? "bg-primary text-primary-foreground animate-pulse" : currentStep === "complete" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {currentStep === "complete" ? <Check className="h-4 w-4" /> : 4}
                  </div>
                  <span className="mt-1">Writing</span>
                </div>
              </div>

              <div className="mt-6 border rounded-md p-4 bg-muted/10">
                <h3 className="text-sm font-medium mb-2">Agent Thoughts</h3>
                <ScrollArea className="h-[200px] w-full pr-4">
                  <div className="space-y-2">
                    {agentThoughts.map((thought, index) => (
                      <div key={index} className="text-sm">
                        <span className="text-muted-foreground">[{new Date().toLocaleTimeString()}]</span> {thought}
                      </div>
                    ))}
                    {currentStep !== "complete" && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Thinking...
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="report">Research Report</TabsTrigger>
            <TabsTrigger value="sources">Sources ({sources.length})</TabsTrigger>
            <TabsTrigger value="agent">Agent Process</TabsTrigger>
          </TabsList>

          <TabsContent value="report" className="mt-4">
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Research Report: {query}</CardTitle>
                  <CardDescription>
                    Generated on {new Date().toLocaleDateString()} • {sources.length} sources
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyReport}>
                    {isCopied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {isCopied ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadReport}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <ScrollArea className="h-[600px] w-full pr-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {researchReport.split("\n\n").map((paragraph, i) => {
                      if (paragraph.startsWith("# ")) {
                        return (
                          <h1 key={i} className="text-2xl font-bold mt-0 mb-4">
                            {paragraph.substring(2)}
                          </h1>
                        )
                      } else if (paragraph.startsWith("## ")) {
                        return (
                          <h2 key={i} className="text-xl font-bold mt-6 mb-3">
                            {paragraph.substring(3)}
                          </h2>
                        )
                      } else if (paragraph.startsWith("### ")) {
                        return (
                          <h3 key={i} className="text-lg font-bold mt-5 mb-2">
                            {paragraph.substring(4)}
                          </h3>
                        )
                      } else if (paragraph.startsWith("- ")) {
                        return (
                          <ul key={i} className="list-disc pl-5 my-2">
                            {paragraph.split("\n").map((item, j) => (
                              <li key={j} className="my-1">
                                {item.substring(2)}
                              </li>
                            ))}
                          </ul>
                        )
                      } else if (paragraph.startsWith("1. ")) {
                        return (
                          <ol key={i} className="list-decimal pl-5 my-2">
                            {paragraph.split("\n").map((item, j) => (
                              <li key={j} className="my-1">
                                {item.substring(3)}
                              </li>
                            ))}
                          </ol>
                        )
                      } else {
                        return (
                          <p key={i} className="my-2">
                            {paragraph}
                          </p>
                        )
                      }
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="mt-4">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Research Sources</CardTitle>
                <CardDescription>{sources.length} sources were used to compile this research</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sources.map((source) => (
                    <div key={source.id} className="border rounded-md p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-md ${
                              source.type === "academic"
                                ? "bg-blue-500/10 text-blue-500"
                                : source.type === "news"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "bg-emerald-500/10 text-emerald-500"
                            }`}
                          >
                            {getSourceIcon(source.type)}
                          </div>
                          <div>
                            <h3 className="font-medium">{source.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 break-all">{source.url}</p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            source.relevance === "high"
                              ? "default"
                              : source.relevance === "medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {source.relevance} relevance
                        </Badge>
                      </div>
                      <p className="text-sm mt-3">{source.snippet}</p>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" className="text-xs h-7" asChild>
                          <a href={source.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Visit Source
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agent" className="mt-4">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Agent Thought Process</CardTitle>
                <CardDescription>How the AI agent approached this research task</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 bg-muted/10">
                  <ScrollArea className="h-[400px] w-full pr-4">
                    <div className="space-y-4">
                      {agentThoughts.map((thought, index) => (
                        <div key={index} className="pb-3 border-b last:border-0">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <span className="font-mono">[{new Date().toLocaleTimeString()}]</span>
                            <Badge variant="outline" className="text-xs">
                              {index < 3 ? "Planning" : index < 7 ? "Searching" : index < 11 ? "Analyzing" : "Writing"}
                            </Badge>
                          </div>
                          <p className="text-sm">{thought}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

