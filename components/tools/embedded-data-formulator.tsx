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
  Database,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export function EmbeddedDataFormulator() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("app")
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Update the embedded data formulator to fit better in the frame
  // Adjust the iframe height and add a scale transform to zoom out the content

  // Update the iframe height calculation to make it taller and fit better
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
      // Only accept messages from the Data Formulator domain
      if (event.origin !== "https://dataformulators.azurewebsites.net") return

      // Handle any messages from the iframe if needed
      console.log("Message from Data Formulator:", event.data)
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
      description: "Failed to load Data Formulator. Please try refreshing.",
      variant: "destructive",
    })
  }

  const refreshIframe = () => {
    setIsLoading(true)
    setHasError(false)
    if (iframeRef.current) {
      iframeRef.current.src = "https://dataformulators.azurewebsites.net/"
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

  // Also reduce padding to maximize space
  return (
    <div className="container mx-auto p-2" ref={containerRef}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
          <div>
            <h1 className="text-xl font-bold flex items-center">
              <div className="mr-2 p-1.5 rounded-md bg-gradient-to-br from-brand-teal/20 to-brand-blue/20 dark:from-brand-teal/30 dark:to-brand-blue/30">
                <Database className="h-4 w-4 text-brand-teal dark:text-brand-teal" />
              </div>
              <span className="gradient-text">Data Formulator</span>
              <Badge className="ml-2 bg-gradient-to-r from-brand-teal to-brand-blue text-white border-none text-xs py-0.5">
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
                      Data Formulator is an AI-powered tool that helps you transform and analyze data using natural
                      language.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h1>
            <p className="text-sm text-muted-foreground">Transform and analyze data with advanced AI assistance</p>
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
                <DropdownMenuItem
                  onClick={() => window.open("https://dataformulators.azurewebsites.net/", "_blank")}
                  className="cursor-pointer hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Tab
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveTab("help")}
                  className="cursor-pointer hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  View Help & Tips
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="app" className="mt-0 p-0">
          <Card className="border shadow-md overflow-hidden transition-all duration-300">
            <CardContent className="p-0 relative">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 p-4">
                  <div className="relative">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-teal mb-3" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Database className="h-3.5 w-3.5 text-brand-teal" />
                    </div>
                  </div>
                  <h3 className="text-base font-medium mb-1">Loading Data Formulator</h3>
                  <p className="text-xs text-muted-foreground text-center max-w-md">
                    Please wait while we connect to the Data Formulator service...
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
                        We couldn't connect to the Data Formulator service. This could be due to network issues or the
                        service may be temporarily unavailable.
                      </AlertDescription>
                    </Alert>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={refreshIframe} size="sm" className="h-7 text-xs">
                        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                        Try Again
                      </Button>
                      <Button
                        onClick={() => window.open("https://dataformulators.azurewebsites.net/", "_blank")}
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
                src="https://dataformulators.azurewebsites.net/"
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
                title="Data Formulator"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="mt-0 p-0">
          <Card className="border shadow-md">
            <CardContent className="pt-4">
              <h2 className="text-base font-bold mb-3 flex items-center">
                <HelpCircle className="mr-1.5 h-4 w-4 text-brand-teal" />
                Data Formulator: Help & Tips
              </h2>

              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-brand-teal/5 to-brand-blue/5 dark:from-brand-teal/10 dark:to-brand-blue/10 border border-brand-teal/10 dark:border-brand-teal/20">
                  <h3 className="text-sm font-medium mb-1.5 flex items-center">
                    <Sparkles className="mr-1.5 h-3.5 w-3.5 text-brand-teal" />
                    Getting Started
                  </h3>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    Data Formulator allows you to transform and analyze data using natural language commands. Here's how
                    to get started:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Select an AI model from the dropdown at the top</li>
                    <li>Add a table by clicking the "Add Table" button</li>
                    <li>Import your data or enter it manually</li>
                    <li>Use natural language to describe how you want to transform your data</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1.5 flex items-center">
                    <Bot className="mr-1.5 h-3.5 w-3.5 text-brand-teal" />
                    Example Commands
                  </h3>
                  <p className="text-xs text-muted-foreground mb-1.5">Here are some example commands you can use:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {[
                      "Filter rows where sales > 1000 and group by region",
                      "Calculate the average price per unit for each product category",
                      "Create a pivot table showing sales by region and product",
                      "Clean this data by removing duplicates and filling missing values",
                      "Visualize sales trends over time as a line chart",
                    ].map((command, index) => (
                      <div
                        key={index}
                        className="flex items-start p-1.5 rounded-md bg-brand-teal/5 dark:bg-brand-teal/10 border border-brand-teal/10 dark:border-brand-teal/20"
                      >
                        <Zap className="h-3.5 w-3.5 text-brand-teal mr-1.5 mt-0.5 flex-shrink-0" />
                        <p className="text-[10px]">{command}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setActiveTab("app")}
                    variant="gradient"
                    className="h-7 text-xs shadow-sm hover:shadow-glow"
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

