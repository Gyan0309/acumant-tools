"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link2, ExternalLink } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Search,
  Loader2,
  Download,
  Copy,
  BookOpen,
  Clock,
  FileText,
  FileQuestion,
  Sparkles,
  Brain,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import api from "@/lib/api";
import ReactMarkdown from "react-markdown";

interface ResearchReportProps {
  data: {
    report: string;
    source_urls: string[];
    research_costs: number;
    num_images: number;
    num_sources: number;
  };
}

export function Researcher() {
  const [isLoading, setIsLoading] = useState(false);
  //   const [pageLoading, setPageLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [reportType, setReportType] = useState("brief");
  const [researchResult, setResearchResult] =
    useState<ResearchReportProps | null>(null);
  const [apiDuration, setApiDuration] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Progress bar animation
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * 5;
          const newProgress = prev + increment;
          return newProgress >= 95 ? 95 : newProgress;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else if (!isLoading && researchResult) {
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [isLoading, researchResult]);

  const handleResearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Query required",
        description: "Please enter a research query",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResearchResult(null);
    setProgress(0);

    try {
      // Simulate API call with timeout
      // In a real implementation, replace this with your actual API call
      const company_id = "AcumantTest";
      const startTime = Date.now();
      const response = await api.get(
        `/gpt-r/company/${company_id}/report/${reportType}`,
        {
          params: { query: query },
        }
      );
      const endTime = Date.now();
      setApiDuration(Math.floor((endTime - startTime) / 1000));

      // console.log("Research API response:", response.data);

      setResearchResult(response.data);
      toast({
        title: "Research complete",
        description: "Your research results are ready to view",
      });
    } catch (error) {
      console.error("Research API error:", error);
      toast({
        title: "Research failed",
        description:
          "There was an error processing your research query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  //   if (pageLoading) {
  //     return (
  //       <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/80">
  //         <div className="animate-pulse flex flex-col items-center">
  //           <div className="h-16 w-16 bg-primary/20 rounded-full mb-4 relative">
  //             <div className="absolute inset-2 bg-primary/30 rounded-full animate-ping"></div>
  //           </div>
  //           <div className="h-4 w-48 bg-muted rounded mb-2"></div>
  //           <div className="h-3 w-32 bg-muted/70 rounded"></div>
  //         </div>
  //       </div>
  //     );
  //   }

  const getReportIcon = () => {
    switch (reportType) {
      case "brief":
        return <FileText className="h-5 w-5" />;
      case "comprehensive":
        return <BookOpen className="h-5 w-5" />;
      case "detailed":
        return <FileQuestion className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getReportTime = () => {
    switch (reportType) {
      case "brief":
        return "2-3 minutes";
      case "comprehensive":
        return "5-7 minutes";
      case "detailed":
        return "10+ minutes";
      default:
        return "2-3 minutes";
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    if (mins === 0) return `${secs} sec${secs !== 1 ? "s" : ""}`;
    if (secs === 0) return `${mins} min${mins !== 1 ? "s" : ""}`;

    return `${mins} min${mins !== 1 ? "s" : ""} ${secs} sec${
      secs !== 1 ? "s" : ""
    }`;
  };

  return (
    <div>
      {/* <DashboardHeader user={user} /> */}
      <div className="flex-1 container py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                Deep Research
              </h1>
              <p className="text-muted-foreground mt-1">
                Conduct comprehensive research on any topic using advanced AI
                technology
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="px-3 py-1 flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                AI-Powered
              </Badge>
              <Badge
                variant="outline"
                className="px-3 py-1 flex items-center gap-1.5"
              >
                <Clock className="h-3.5 w-3.5 text-primary" />
                {getReportTime()}
              </Badge>
            </div>
          </div>

          <Card className="border shadow-md overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Research Query
                </CardTitle>
                <div className="flex items-center gap-2">
                  {getReportIcon()}
                  <Select
                    value={reportType}
                    onValueChange={setReportType}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="report-type" className="w-[180px]">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brief">Brief Summary</SelectItem>
                      <SelectItem value="comprehensive">
                        Comprehensive Report
                      </SelectItem>
                      <SelectItem value="detailed">
                        Detailed Analysis
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="research-query"
                  className="text-base font-medium"
                >
                  What would you like me to research?
                </Label>
                <Textarea
                  id="research-query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your research topic or question (e.g., 'What are the latest advancements in quantum computing?')"
                  className="w-full min-h-[150px] resize-y text-base"
                />
                <p className="text-xs text-muted-foreground">
                  For best results, be specific about what you want to learn.
                  Include key terms and context.
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleResearch}
                  disabled={isLoading || !query.trim()}
                  className="bg-primary hover:bg-primary/90 text-white px-6"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      Start Research
                      <Search className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>

              {isLoading && (
                <div className="py-16 flex flex-col items-center justify-center space-y-8">
                  <div className="relative w-28 h-28">
                    <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
                    <div className="absolute inset-3 rounded-full border-r-4 border-l-4 border-primary/30 animate-spin animation-delay-150"></div>
                    <div className="absolute inset-6 rounded-full border-t-4 border-b-4 border-primary/50 animate-spin animation-delay-300 animate-reverse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="h-10 w-10 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-medium">
                      Researching your query
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Analyzing sources and generating a {reportType} report on{" "}
                      {query}
                    </p>
                  </div>
                  <div className="w-full max-w-md">
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Gathering data</span>
                      <span>Analyzing</span>
                      <span>Finalizing</span>
                    </div>
                  </div>
                </div>
              )}
              {researchResult?.data?.report && !isLoading && (
                <div className="max-w-full mx-auto">
                  <Card className="shadow-lg border-border">
                    <CardHeader className="border-b bg-muted/30">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                          <FileText className="h-6 w-6 text-primary" />
                          Research Report
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1.5"
                          >
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            Duration:{" "}
                            {apiDuration !== null
                              ? formatDuration(apiDuration)
                              : "..."}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1.5"
                          >
                            <Link2 className="h-3.5 w-3.5 text-primary" />
                            Sources: {researchResult.data.num_sources}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <Tabs defaultValue="report" className="w-full">
                      <div className="px-6 pt-4 border-b">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="report">Report</TabsTrigger>
                          <TabsTrigger value="references">
                            References
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value="report" className="mt-0">
                        <CardContent className="p-6">
                          <div className="prose prose-sm dark:prose-invert max-w-none [&>*:last-child]:mb-0">
                            <ReactMarkdown
                              components={{
                                h1: ({ node, ...props }) => (
                                  <h1
                                    className="text-2xl font-bold mt-4 mb-2"
                                    {...props}
                                  />
                                ),
                                h2: ({ node, ...props }) => (
                                  <h2
                                    className="text-xl font-semibold mt-4 mb-2"
                                    {...props}
                                  />
                                ),
                                h3: ({ node, ...props }) => (
                                  <>
                                    <h3
                                      className="text-lg font-medium mt-4 mb-2"
                                      {...props}
                                    />
                                  </>
                                ),
                                p: ({ node, ...props }) => (
                                  <p
                                    className="text-base leading-relaxed mb-2"
                                    {...props}
                                  />
                                ),
                                hr: () => null,
                              }}
                            >
                              {researchResult.data.report}
                            </ReactMarkdown>
                          </div>
                        </CardContent>
                      </TabsContent>

                      <TabsContent value="references" className="mt-0">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-medium mb-4">
                            Source URLs
                          </h3>
                          <div className="space-y-3">
                            {researchResult.data.source_urls?.map(
                              (url, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2 p-3 rounded-md border bg-card/50 hover:bg-card transition-colors"
                                >
                                  <ExternalLink className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline break-all"
                                  >
                                    {url}
                                  </a>
                                </div>
                              )
                            )}
                          </div>
                        </CardContent>
                      </TabsContent>
                    </Tabs>

                    <div className="flex justify-end gap-3 px-6 pb-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            researchResult.data.report
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5"
                        onClick={() => {
                          const element = document.createElement("a");
                          const file = new Blob([researchResult.data.report], {
                            type: "text/markdown",
                          });
                          element.href = URL.createObjectURL(file);
                          element.download = `research-${query
                            .slice(0, 30)
                            .replace(/[^a-z0-9]/gi, "-")
                            .toLowerCase()}.md`;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        className="flex items-center gap-1.5"
                        onClick={() => {
                          setQuery("");
                          setResearchResult(null);
                        }}
                      >
                        <Search className="h-4 w-4" />
                        New Research
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border shadow-sm bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Research Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex gap-2">
                  <div className="mt-0.5 text-primary">
                    <Search className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Be specific</p>
                    <p className="text-muted-foreground">
                      Include key terms and context in your query
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="mt-0.5 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Choose the right depth</p>
                    <p className="text-muted-foreground">
                      Select report type based on your needs
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="mt-0.5 text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Be patient</p>
                    <p className="text-muted-foreground">
                      Detailed research takes time to generate
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
