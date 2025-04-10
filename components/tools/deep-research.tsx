"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Search, FileText, Download, LinkIcon, Clock } from "lucide-react"

export function DeepResearch() {
  const [query, setQuery] = useState("")
  const [isResearching, setIsResearching] = useState(false)
  const [researchResults, setResearchResults] = useState("")
  const [activeTab, setActiveTab] = useState("query")
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsResearching(true)

    try {
      // In a real app, this would call an API to perform the research
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock research results
      const results = `# Research Results for: "${query}"\n\n## Overview\nThis is a comprehensive analysis of the topic based on multiple sources.\n\n## Key Findings\n1. First important finding about ${query}\n2. Second important finding about ${query}\n3. Third important finding about ${query}\n\n## Detailed Analysis\nThe detailed analysis shows that ${query} has significant implications in various fields...`

      setResearchResults(results)
      setActiveTab("results")

      // Add to search history
      setSearchHistory((prev) => [query, ...prev.slice(0, 4)])
    } catch (error) {
      console.error("Error performing research:", error)
    } finally {
      setIsResearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="query">Research Query</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="query" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="research-query">What would you like to research?</Label>
            <div className="flex gap-2">
              <Input
                id="research-query"
                placeholder="Enter your research topic or question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isResearching || !query.trim()}>
                {isResearching ? "Researching..." : "Research"}
                <Search className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Research Tips</h3>
              <ul className="space-y-2 text-sm">
                <li>Be specific with your research questions</li>
                <li>Include relevant keywords for better results</li>
                <li>For complex topics, break down into smaller questions</li>
                <li>Specify time periods if researching historical topics</li>
                <li>Include industry or field names for specialized research</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {researchResults ? (
            <>
              <Textarea value={researchResults} readOnly className="min-h-[400px] font-mono" />
              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Save as PDF
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 border rounded-md bg-muted/20">
              <p className="text-muted-foreground">No research results yet. Start a new search.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          {researchResults ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sources Used</h3>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <LinkIcon className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                      <div>
                        <h4 className="font-medium">
                          Source {i + 1}: {query} Research Paper
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Author: John Doe et al. • Published: 2023 • Relevance: High
                        </p>
                        <p className="text-sm mt-1">
                          This source provides comprehensive information about {query} with detailed analysis and case
                          studies.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 border rounded-md bg-muted/20">
              <p className="text-muted-foreground">No sources available. Complete a research query first.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <h3 className="text-lg font-medium">Recent Searches</h3>
          {searchHistory.length > 0 ? (
            <div className="space-y-2">
              {searchHistory.map((item, i) => (
                <Card key={i} className="cursor-pointer hover:bg-muted/50" onClick={() => setQuery(item)}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Clock className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{item}</p>
                      <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 border rounded-md bg-muted/20">
              <p className="text-muted-foreground">No search history yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

