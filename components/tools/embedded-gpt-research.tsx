"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Maximize2,
  RefreshCw,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Settings,
  Info,
  Sparkles,
  Bot,
  Zap,
  Search,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export function EmbeddedGPTResearch() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("app")
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Update the iframe height calculation to make it taller
  const [iframeHeight, setIframeHeight] = useState("calc(100vh - 80px)")

  useEffect(() => {
    const updateIframeHeight = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        // Increase the height by reducing the subtracted amount
        const newHeight = window.innerHeight - containerRect.top - 5
        setIframeHeight(`${newHeight}px`)
      }
    }

    // Initial height calculation
    updateIframeHeight()

    // Update height on window resize
    window.addEventListener("resize", updateIframeHeight)
    return () => window.removeEventListener("resize", updateIframeHeight)
  }, [])

  useEffect(() => {
    // Function to handle messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from the GPT Research domain
      if (event.origin !== "https://app-deepresearch.azurewebsites.net") return

      // Handle any messages from the iframe if needed
      console.log("Message from GPT Research:", event.data)
    }

    // Add event listener for messages
    window.addEventListener("message", handleMessage)

    // Clean up
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
    toast({
      title: "Connection Error",
      description: "Failed to load GPT Research. Please try refreshing.",
      variant: "destructive",
    })
  }

  const refreshIframe = () => {
    setIsLoading(true)
    setHasError(false)
    if (iframeRef.current) {
      iframeRef.current.src = "https://app-deepresearch.azurewebsites.net/"
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        toast({
          title: "Fullscreen Error",
          description: `Error attempting to enable fullscreen: ${err.message}`,
          variant: "destructive",
        })
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  return (
    <div className="container mx-auto p-2" ref={containerRef}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
          <div>
            <h1 className="text-xl font-bold flex items-center">
              <div className="mr-2 p-1.5 rounded-md bg-gradient-to-br from-brand-purple/20 to-brand-cyan/20 dark:from-brand-purple/30 dark:to-brand-cyan/30">
                <Search className="h-4 w-4 text-brand-purple dark:text-brand-purple" />
              </div>
              <span className="gradient-text">GPT Researcher</span>
              <Badge className="ml-2 bg-gradient-to-r from-brand-blue to-brand-purple text-white border-none text-xs py-0.5">
                <Sparkles className="h-3 w-3 mr-1" /> AI-Powered
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-1.5 h-7 w-7">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm">
                    <p className="text-sm">
                      GPT Researcher is an autonomous agent that conducts comprehensive research on any topic using the
                      latest AI technology.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h1>
            <p className="text-sm text-muted-foreground">Conduct in-depth research and analysis on any topic</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <TabsList className="mr-2 bg-muted/50 p-1">
              <TabsTrigger
                value="app"
                className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-sm h-8"
              >
                Application
              </TabsTrigger>
              <TabsTrigger
                value="help"
                className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-sm h-8"
              >
                Help
              </TabsTrigger>
            </TabsList>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={refreshIframe}
                    disabled={isLoading}
                    className="border-muted bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 h-8 w-8"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="border-muted bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 h-8 w-8"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fullscreen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-muted bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 h-8 z-[900]"
                >
                  Options <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 z-[1000]" sideOffset={5}>
                <DropdownMenuItem onClick={() => window.open("https://app-deepresearch.azurewebsites.net/", "_blank")}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Tab
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("help")}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  View Help & Tips
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="app" className="mt-0 p-0">
          <Card className="border shadow-md overflow-hidden transition-all duration-300 gradient-border">
            <CardContent className="p-0 relative">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 p-4">
                  <div className="relative">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-purple mb-3" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Search className="h-3.5 w-3.5 text-brand-purple" />
                    </div>
                  </div>
                  <h3 className="text-base font-medium mb-1">Loading GPT Researcher</h3>
                  <p className="text-xs text-muted-foreground text-center max-w-md">
                    Please wait while we connect to the GPT Researcher service...
                  </p>
                  <div className="w-full max-w-md mt-6">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-full shimmer" />
                      <Skeleton className="h-24 w-full shimmer" />
                      <div className="flex gap-2">
                        <Skeleton className="h-7 w-20 shimmer" />
                        <Skeleton className="h-7 w-28 shimmer" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/95 z-10 p-4">
                  <div className="max-w-md w-full">
                    <Alert variant="destructive" className="mb-3">
                      <AlertTitle className="text-sm">Connection Error</AlertTitle>
                      <AlertDescription className="text-xs">
                        We couldn't connect to the GPT Researcher service. This could be due to network issues or the
                        service may be temporarily unavailable.
                      </AlertDescription>
                    </Alert>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={refreshIframe} size="sm" className="h-7 text-xs">
                        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                        Try Again
                      </Button>
                      <Button
                        onClick={() => window.open("https://app-deepresearch.azurewebsites.net/", "_blank")}
                        size="sm"
                        className="h-7 text-xs"
                      >
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        Open in Browser
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <iframe
                ref={iframeRef}
                src="https://app-deepresearch.azurewebsites.net/"
                className="w-full transition-all duration-300"
                style={{
                  height: iframeHeight,
                  transform: "scale(0.95)",
                  transformOrigin: "top center",
                  marginTop: "5px", // Add margin to prevent overlap with top border
                }}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                allow="clipboard-read; clipboard-write"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
                title="GPT Researcher"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="mt-0 p-0">
          <Card className="border shadow-md">
            <CardContent className="pt-4">
              <h2 className="text-base font-bold mb-3 flex items-center">
                <HelpCircle className="mr-1.5 h-4 w-4 text-brand-purple" />
                GPT Researcher: Help & Tips
              </h2>

              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-brand-purple/5 to-brand-cyan/5 dark:from-brand-purple/10 dark:to-brand-cyan/10 border border-brand-purple/10 dark:border-brand-purple/20">
                  <h3 className="text-sm font-medium mb-1.5 flex items-center">
                    <Sparkles className="mr-1.5 h-3.5 w-3.5 text-brand-purple" />
                    Getting Started
                  </h3>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    GPT Researcher is an autonomous agent that conducts comprehensive research on any topic. Here's how
                    to get started:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Enter your research topic or question in the input field</li>
                    <li>Select the report type and other options as needed</li>
                    <li>Click "Start Research" to begin the research process</li>
                    <li>Wait for the agent to complete its research and generate a report</li>
                    <li>Review the report and sources</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1.5 flex items-center">
                    <Bot className="mr-1.5 h-3.5 w-3.5 text-brand-purple" />
                    Research Tips
                  </h3>
                  <p className="text-xs text-muted-foreground mb-1.5">For better research results:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {[
                      "Be specific with your research questions",
                      "Include relevant keywords for better results",
                      "For complex topics, break down into smaller questions",
                      "Specify time periods if researching historical topics",
                      "Include industry or field names for specialized research",
                    ].map((tip, index) => (
                      <div
                        key={index}
                        className="flex items-start p-1.5 rounded-md bg-brand-purple/5 dark:bg-brand-purple/10 border border-brand-purple/10 dark:border-brand-purple/20"
                      >
                        <Zap className="h-3.5 w-3.5 text-brand-purple mr-1.5 mt-0.5 flex-shrink-0" />
                        <p className="text-[10px]">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setActiveTab("app")}
                    className="bg-gradient-to-r from-brand-purple to-brand-cyan hover:from-brand-purple/90 hover:to-brand-cyan/90 h-7 text-xs shadow-sm hover:shadow-glow-cyan"
                  >
                    <Zap className="mr-1.5 h-3.5 w-3.5" />
                    Return to Application
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-[10px] text-muted-foreground flex items-center justify-between mt-2">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px]" onClick={() => setActiveTab("help")}>
            <HelpCircle className="h-2.5 w-2.5 mr-1" />
            Help
          </Button>
        </div>
      </div>
    </div>
  )
}

