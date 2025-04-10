"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, Globe, BookOpen, FileText, Settings, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

interface DeepResearchFormProps {
  onStartResearch: (query: string, options: ResearchOptions) => void
}

export interface ResearchOptions {
  reportType: string
  tone: string
  sources: string[]
  maxSources: number
  language: string
  focusArea: string
  depth: number
  websitesToInclude: string
  websitesToExclude: string
}

export function DeepResearchForm({ onStartResearch }: DeepResearchFormProps) {
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Research configuration options
  const [reportType, setReportType] = useState("comprehensive")
  const [tone, setTone] = useState("objective")
  const [sources, setSources] = useState<string[]>(["web", "academic"])
  const [maxSources, setMaxSources] = useState(8)
  const [language, setLanguage] = useState("english")
  const [focusArea, setFocusArea] = useState("general")
  const [depth, setDepth] = useState(70)
  const [websitesToInclude, setWebsitesToInclude] = useState("")
  const [websitesToExclude, setWebsitesToExclude] = useState("")

  const handleSourceToggle = (source: string) => {
    setSources((prev) => (prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSubmitting(true)

    const options: ResearchOptions = {
      reportType,
      tone,
      sources,
      maxSources,
      language,
      focusArea,
      depth,
      websitesToInclude,
      websitesToExclude,
    }

    // Simulate API call delay
    setTimeout(() => {
      onStartResearch(query, options)
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          GPT Researcher
        </CardTitle>
        <CardDescription>
          Autonomous agent that conducts comprehensive research on any topic using the latest AI technology
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="research-query" className="text-base font-medium">
              What would you like me to research?
            </Label>
            <Textarea
              id="research-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your research topic or question (e.g., 'What are the latest advancements in quantum computing?')"
              required
              className="w-full min-h-[100px] resize-y"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="basic">Basic Options</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brief">Brief Summary (2-3 min)</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Report (5-7 min)</SelectItem>
                      <SelectItem value="detailed">Detailed Analysis (10+ min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Research Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="objective">Objective & Factual</SelectItem>
                      <SelectItem value="analytical">Analytical & Critical</SelectItem>
                      <SelectItem value="persuasive">Persuasive & Argumentative</SelectItem>
                      <SelectItem value="exploratory">Exploratory & Curious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="block mb-2">Information Sources</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="source-web"
                      checked={sources.includes("web")}
                      onCheckedChange={() => handleSourceToggle("web")}
                    />
                    <Label htmlFor="source-web" className="cursor-pointer flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" /> Web
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="source-academic"
                      checked={sources.includes("academic")}
                      onCheckedChange={() => handleSourceToggle("academic")}
                    />
                    <Label htmlFor="source-academic" className="cursor-pointer flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> Academic
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="source-news"
                      checked={sources.includes("news")}
                      onCheckedChange={() => handleSourceToggle("news")}
                    />
                    <Label htmlFor="source-news" className="cursor-pointer flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" /> News
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="source-local"
                      checked={sources.includes("local")}
                      onCheckedChange={() => handleSourceToggle("local")}
                    />
                    <Label htmlFor="source-local" className="cursor-pointer flex items-center gap-1">
                      <Settings className="h-3.5 w-3.5" /> Local Docs
                    </Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Output Language</Label>
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
                      <SelectItem value="japanese">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focus-area">Research Focus</Label>
                  <Select value={focusArea} onValueChange={setFocusArea}>
                    <SelectTrigger id="focus-area">
                      <SelectValue placeholder="Select focus area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="scientific">Scientific</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="historical">Historical</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="depth">Research Depth</Label>
                  <span className="text-sm text-muted-foreground">{depth}%</span>
                </div>
                <Slider
                  id="depth"
                  min={30}
                  max={100}
                  step={10}
                  value={[depth]}
                  onValueChange={(value) => setDepth(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Faster</span>
                  <span>Deeper</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-sources">Maximum Sources</Label>
                <Select value={maxSources.toString()} onValueChange={(v) => setMaxSources(Number.parseInt(v))}>
                  <SelectTrigger id="max-sources">
                    <SelectValue placeholder="Select max sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 sources</SelectItem>
                    <SelectItem value="8">8 sources</SelectItem>
                    <SelectItem value="12">12 sources</SelectItem>
                    <SelectItem value="16">16 sources</SelectItem>
                    <SelectItem value="20">20 sources</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="websites-include">Websites to Include (Optional)</Label>
                <Input
                  id="websites-include"
                  value={websitesToInclude}
                  onChange={(e) => setWebsitesToInclude(e.target.value)}
                  placeholder="e.g., nature.com, science.org (comma separated)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="websites-exclude">Websites to Exclude (Optional)</Label>
                <Input
                  id="websites-exclude"
                  value={websitesToExclude}
                  onChange={(e) => setWebsitesToExclude(e.target.value)}
                  placeholder="e.g., wikipedia.org, quora.com (comma separated)"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              <span>
                Estimated time: {reportType === "brief" ? "2-3" : reportType === "comprehensive" ? "5-7" : "10+"}{" "}
                minutes
              </span>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || !query.trim() || sources.length === 0}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {isSubmitting ? "Researching..." : "Start Research"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

