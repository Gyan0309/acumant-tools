"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Copy, ExternalLink, Loader2, Clock, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function GPTResearchInterface() {
  const [query, setQuery] = useState("")
  const [isResearching, setIsResearching] = useState(false)
  const [researchCompleted, setResearchCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState("form")
  const [reportType, setReportType] = useState("comprehensive")
  const [taskType, setTaskType] = useState("research")
  const [language, setLanguage] = useState("english")
  const [researchDepth, setResearchDepth] = useState("moderate")
  const [focusedOn, setFocusedOn] = useState<string[]>(["web_search"])
  const [agentThoughts, setAgentThoughts] = useState<string[]>([])
  const [researchReport, setResearchReport] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleFocusToggle = (value: string) => {
    setFocusedOn((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }

  const handleStartResearch = async () => {
    if (!query.trim()) return

    setIsResearching(true)
    setActiveTab("research")

    // Simulate the research process
    setAgentThoughts(["I'll research: " + query, "Breaking down this query into sub-questions to research thoroughly."])

    await new Promise((r) => setTimeout(r, 2000))

    setAgentThoughts((prev) => [
      ...prev,
      "Searching for information from multiple sources...",
      "Looking for academic papers on " + query,
    ])

    await new Promise((r) => setTimeout(r, 3000))

    setAgentThoughts((prev) => [
      ...prev,
      "Analyzing information from collected sources",
      "Comparing different perspectives on " + query,
    ])

    await new Promise((r) => setTimeout(r, 3000))

    setAgentThoughts((prev) => [
      ...prev,
      "Synthesizing information into a coherent report",
      "Finalizing report with executive summary and conclusions",
    ])

    // Generate mock report
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

    setResearchReport(mockReport)

    await new Promise((r) => setTimeout(r, 2000))

    setIsResearching(false)
    setResearchCompleted(true)
  }

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

  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="form">Research Form</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="report" disabled={!researchCompleted}>
            Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">GPT Researcher</CardTitle>
                <CardDescription>Autonomous agent for comprehensive research on any topic</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="query" className="text-base font-medium">
                    What would you like me to research?
                  </Label>
                  <Textarea
                    id="query"
                    placeholder="Enter your research topic or question..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger id="report-type">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                        <SelectItem value="brief">Brief Summary</SelectItem>
                        <SelectItem value="bullet_points">Bullet Points</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-type">Task Type</Label>
                    <Select value={taskType} onValueChange={setTaskType}>
                      <SelectTrigger id="task-type">
                        <SelectValue placeholder="Select task type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="analyze">Analyze</SelectItem>
                        <SelectItem value="write">Write</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="research-depth">Research Depth</Label>
                    <Select value={researchDepth} onValueChange={setResearchDepth}>
                      <SelectTrigger id="research-depth">
                        <SelectValue placeholder="Select research depth" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Focus On</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="focus-web"
                        checked={focusedOn.includes("web_search")}
                        onCheckedChange={() => handleFocusToggle("web_search")}
                      />
                      <Label htmlFor="focus-web" className="cursor-pointer">
                        Web Search
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="focus-academic"
                        checked={focusedOn.includes("academic_papers")}
                        onCheckedChange={() => handleFocusToggle("academic_papers")}
                      />
                      <Label htmlFor="focus-academic" className="cursor-pointer">
                        Academic Papers
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="focus-news"
                        checked={focusedOn.includes("recent_news")}
                        onCheckedChange={() => handleFocusToggle("recent_news")}
                      />
                      <Label htmlFor="focus-news" className="cursor-pointer">
                        Recent News
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="focus-market"
                        checked={focusedOn.includes("market_research")}
                        onCheckedChange={() => handleFocusToggle("market_research")}
                      />
                      <Label htmlFor="focus-market" className="cursor-pointer">
                        Market Research
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-instructions">Custom Instructions (Optional)</Label>
                  <Textarea
                    id="custom-instructions"
                    placeholder="Add any specific instructions for the research agent..."
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Estimated time: 5-10 minutes</span>
                </div>
                <Button
                  onClick={handleStartResearch}
                  disabled={!query.trim() || focusedOn.length === 0}
                  className="px-8"
                >
                  Start Research
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="research">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {isResearching ? (
                    <div className="flex items-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Research in Progress
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      Research Completed
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  {isResearching
                    ? "GPT Researcher is working on your query. This may take 5-10 minutes."
                    : "Research has been completed. You can now view the report."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">Research Query</h3>
                    <p className="text-sm">{query}</p>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Agent Thoughts</h3>
                    <ScrollArea className="h-[300px] w-full pr-4">
                      <div className="space-y-2">
                        {agentThoughts.map((thought, index) => (
                          <div key={index} className="text-sm">
                            <span className="text-muted-foreground">[{new Date().toLocaleTimeString()}]</span> {thought}
                          </div>
                        ))}
                        {isResearching && (
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
              <CardFooter className="flex justify-end">
                {researchCompleted && <Button onClick={() => setActiveTab("report")}>View Report</Button>}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="report">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Research Report: {query}</CardTitle>
                  <CardDescription>Generated on {new Date().toLocaleDateString()}</CardDescription>
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
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("form")}>
                  New Research
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Sources
                  </Button>
                  <Button>Share Report</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

