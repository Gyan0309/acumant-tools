"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Download,
  Upload,
  Sparkles,
  TableIcon,
  Loader2,
  RefreshCw,
  Check,
  Wand2,
  ArrowRight,
  Plus,
  Save,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface DataColumn {
  name: string
  type: "string" | "number" | "date" | "boolean"
  sample: string
}

interface DataTransformation {
  id: string
  type: string
  description: string
  applied: boolean
}

export function DataFormulator() {
  const [inputData, setInputData] = useState("")
  const [outputData, setOutputData] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("input")
  const [visualizationType, setVisualizationType] = useState("table")
  const [detectedColumns, setDetectedColumns] = useState<DataColumn[]>([])
  const [suggestedTransformations, setSuggestedTransformations] = useState<DataTransformation[]>([])
  const [visualizationPrompt, setVisualizationPrompt] = useState("")
  const [isGeneratingVisualization, setIsGeneratingVisualization] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  // Sample data for demonstration
  const sampleData = `date,region,product,sales,units
2023-01-15,North,Widget A,12500,125
2023-01-15,South,Widget B,9800,82
2023-01-15,East,Widget A,11200,112
2023-01-15,West,Widget C,15400,110
2023-02-15,North,Widget B,13600,113
2023-02-15,South,Widget A,10200,102
2023-02-15,East,Widget C,9500,76
2023-02-15,West,Widget B,14300,119
2023-03-15,North,Widget C,16700,139
2023-03-15,South,Widget B,11900,99
2023-03-15,East,Widget A,12800,128
2023-03-15,West,Widget C,17200,123`

  useEffect(() => {
    if (activeTab === "visualization" && canvasRef.current && outputData) {
      renderVisualization()
    }
  }, [activeTab, visualizationType, outputData])

  const handleProcessData = async () => {
    if (!inputData.trim()) return

    setIsProcessing(true)

    try {
      // Simulate API call for data processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Parse the input data (assuming CSV for this example)
      const lines = inputData.trim().split("\n")
      const headers = lines[0].split(",")

      // Detect column types
      const detectedCols: DataColumn[] = headers.map((header, index) => {
        const sampleValues = lines.slice(1, 4).map((line) => line.split(",")[index])
        const sample = sampleValues[0] || ""

        // Simple type detection
        let type: "string" | "number" | "date" | "boolean" = "string"
        if (!isNaN(Number(sample))) {
          type = "number"
        } else if (/^\d{4}-\d{2}-\d{2}/.test(sample)) {
          type = "date"
        } else if (sample.toLowerCase() === "true" || sample.toLowerCase() === "false") {
          type = "boolean"
        }

        return {
          name: header.trim(),
          type,
          sample,
        }
      })

      setDetectedColumns(detectedCols)

      // Generate suggested transformations
      const suggestedTrans: DataTransformation[] = [
        {
          id: "1",
          type: "clean",
          description: "Clean column names (remove spaces, special characters)",
          applied: false,
        },
        {
          id: "2",
          type: "format",
          description: "Format date columns to standard ISO format",
          applied: false,
        },
        {
          id: "3",
          type: "aggregate",
          description: "Aggregate sales by region and product",
          applied: false,
        },
        {
          id: "4",
          type: "calculate",
          description: "Calculate average price per unit",
          applied: false,
        },
        {
          id: "5",
          type: "filter",
          description: "Filter out rows with sales below average",
          applied: false,
        },
      ]

      setSuggestedTransformations(suggestedTrans)

      // Set processed output data
      setOutputData(inputData)
      setActiveTab("transform")
    } catch (error) {
      console.error("Error processing data:", error)
      toast({
        title: "Processing Error",
        description: "An error occurred while processing your data.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const applyTransformation = (id: string) => {
    setSuggestedTransformations((prev) => prev.map((t) => (t.id === id ? { ...t, applied: !t.applied } : t)))

    // Simulate applying the transformation
    toast({
      title: "Transformation Applied",
      description: "The selected transformation has been applied to your data.",
    })
  }

  const handleGenerateVisualization = async () => {
    if (!outputData) return

    setIsGeneratingVisualization(true)

    try {
      // Simulate API call for AI-powered visualization generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate visualization code based on the prompt and data
      const generatedVizCode = `// Generated visualization code
import { Chart } from 'chart.js/auto';

// Setup the chart with the processed data
const ctx = document.getElementById('dataChart').getContext('2d');
const chart = new Chart(ctx, {
  type: '${visualizationType === "bar" ? "bar" : visualizationType === "line" ? "line" : "pie"}',
  data: {
    labels: ['North', 'South', 'East', 'West'],
    datasets: [{
      label: 'Sales by Region',
      data: [42800, 31900, 33500, 46900],
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(255, 99, 132, 0.2)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Sales Distribution by Region'
      },
      legend: {
        position: 'bottom'
      }
    }
  }
});`

      setGeneratedCode(generatedVizCode)
      renderVisualization()
      setActiveTab("visualization")

      toast({
        title: "Visualization Generated",
        description: "AI has created a visualization based on your data and prompt.",
      })
    } catch (error) {
      console.error("Error generating visualization:", error)
      toast({
        title: "Generation Error",
        description: "An error occurred while generating the visualization.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingVisualization(false)
    }
  }

  const renderVisualization = () => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear previous visualization
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Draw a simple visualization based on the selected type
    const width = canvasRef.current.width
    const height = canvasRef.current.height

    if (visualizationType === "bar") {
      // Simple bar chart
      const data = [42800, 31900, 33500, 46900]
      const labels = ["North", "South", "East", "West"]
      const barWidth = width / (data.length * 2)
      const maxValue = Math.max(...data)

      ctx.fillStyle = "#f0f0f0"
      ctx.fillRect(0, 0, width, height)

      // Draw bars
      data.forEach((value, index) => {
        const barHeight = (value / maxValue) * (height - 60)
        const x = index * (barWidth * 2) + barWidth / 2
        const y = height - barHeight - 30

        ctx.fillStyle = `hsl(${index * 90}, 70%, 60%)`
        ctx.fillRect(x, y, barWidth, barHeight)

        // Draw label
        ctx.fillStyle = "#333"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText(labels[index], x + barWidth / 2, height - 10)

        // Draw value
        ctx.fillText(value.toString(), x + barWidth / 2, y - 5)
      })

      // Draw title
      ctx.fillStyle = "#333"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Sales Distribution by Region", width / 2, 20)
    } else if (visualizationType === "line") {
      // Simple line chart
      const data = [42800, 31900, 33500, 46900]
      const labels = ["North", "South", "East", "West"]
      const step = width / (data.length - 1)
      const maxValue = Math.max(...data)

      ctx.fillStyle = "#f0f0f0"
      ctx.fillRect(0, 0, width, height)

      // Draw line
      ctx.beginPath()
      ctx.moveTo(0, height - (data[0] / maxValue) * (height - 60) - 30)

      data.forEach((value, index) => {
        if (index > 0) {
          const x = index * step
          const y = height - (value / maxValue) * (height - 60) - 30
          ctx.lineTo(x, y)
        }
      })

      ctx.strokeStyle = "rgba(75, 192, 192, 1)"
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw points and labels
      data.forEach((value, index) => {
        const x = index * step
        const y = height - (value / maxValue) * (height - 60) - 30

        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(75, 192, 192, 1)"
        ctx.fill()

        // Draw label
        ctx.fillStyle = "#333"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText(labels[index], x, height - 10)

        // Draw value
        ctx.fillText(value.toString(), x, y - 10)
      })

      // Draw title
      ctx.fillStyle = "#333"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Sales Trend by Region", width / 2, 20)
    } else if (visualizationType === "pie") {
      // Simple pie chart
      const data = [42800, 31900, 33500, 46900]
      const labels = ["North", "South", "East", "West"]
      const colors = [
        "rgba(75, 192, 192, 0.8)",
        "rgba(54, 162, 235, 0.8)",
        "rgba(255, 206, 86, 0.8)",
        "rgba(255, 99, 132, 0.8)",
      ]

      const total = data.reduce((sum, value) => sum + value, 0)
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(centerX, centerY) - 40

      ctx.fillStyle = "#f0f0f0"
      ctx.fillRect(0, 0, width, height)

      // Draw pie segments
      let startAngle = 0
      data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
        ctx.closePath()

        ctx.fillStyle = colors[index]
        ctx.fill()

        // Draw label line and text
        const midAngle = startAngle + sliceAngle / 2
        const labelRadius = radius * 1.2
        const labelX = centerX + Math.cos(midAngle) * labelRadius
        const labelY = centerY + Math.sin(midAngle) * labelRadius

        ctx.beginPath()
        ctx.moveTo(centerX + Math.cos(midAngle) * radius, centerY + Math.sin(midAngle) * radius)
        ctx.lineTo(labelX, labelY)
        ctx.strokeStyle = "#666"
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.fillStyle = "#333"
        ctx.font = "12px Arial"
        ctx.textAlign = midAngle < Math.PI ? "left" : "right"
        ctx.fillText(`${labels[index]}: ${Math.round((value / total) * 100)}%`, labelX, labelY)

        startAngle += sliceAngle
      })

      // Draw title
      ctx.fillStyle = "#333"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Sales Distribution by Region", width / 2, 20)
    }
  }

  const handleLoadSampleData = () => {
    setInputData(sampleData)
    toast({
      title: "Sample Data Loaded",
      description: "Sample sales data has been loaded for demonstration.",
    })
  }

  const handleDownloadData = () => {
    const element = document.createElement("a")
    const file = new Blob([outputData], { type: "text/csv" })
    element.href = URL.createObjectURL(file)
    element.download = "processed_data.csv"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Data Downloaded",
      description: "The processed data has been downloaded as a CSV file.",
    })
  }

  const handleDownloadVisualization = () => {
    if (!canvasRef.current) return

    const dataURL = canvasRef.current.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = "data_visualization.png"
    link.href = dataURL
    link.click()

    toast({
      title: "Visualization Downloaded",
      description: "The visualization has been downloaded as a PNG image.",
    })
  }

  const handleSaveCode = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedCode], { type: "text/javascript" })
    element.href = URL.createObjectURL(file)
    element.download = "visualization_code.js"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Code Saved",
      description: "The visualization code has been saved as a JavaScript file.",
    })
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="input">Input Data</TabsTrigger>
          <TabsTrigger value="transform">Transform</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Data Input</CardTitle>
              <CardDescription>Enter your data in CSV, JSON, or plain text format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste CSV, JSON, or plain text data here..."
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleLoadSampleData}>
                  Load Sample Data
                </Button>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
                <Button onClick={handleProcessData} disabled={isProcessing || !inputData.trim()} className="ml-auto">
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Process Data
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Data Formulator Tips</CardTitle>
              <CardDescription>Get the most out of the AI-powered data transformation tool</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Supported Formats</h3>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    <li>CSV (comma-separated values)</li>
                    <li>JSON (JavaScript Object Notation)</li>
                    <li>Excel-like tabular data</li>
                    <li>Plain text with consistent delimiters</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Best Practices</h3>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    <li>Include headers in your data</li>
                    <li>Ensure consistent formatting</li>
                    <li>Clean data before uploading for best results</li>
                    <li>Use descriptive column names</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transform" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>Preview of your data with detected column types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        {detectedColumns.map((col, i) => (
                          <th key={i} className="p-2 text-left text-sm">
                            <div className="font-medium">{col.name}</div>
                            <div className="text-xs text-muted-foreground">{col.type}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {inputData
                        .split("\n")
                        .slice(1, 6)
                        .map((row, i) => (
                          <tr key={i} className="border-t">
                            {row.split(",").map((cell, j) => (
                              <td key={j} className="p-2 text-sm">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Column Details</CardTitle>
                <CardDescription>Information about detected columns</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {detectedColumns.map((col, i) => (
                      <div key={i} className="pb-3 border-b last:border-0">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{col.name}</div>
                          <Badge variant="outline">{col.type}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Sample: {col.sample}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>AI-Suggested Transformations</CardTitle>
              <CardDescription>Recommended transformations based on your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestedTransformations.map((transform) => (
                  <div
                    key={transform.id}
                    className="flex items-center justify-between border rounded-md p-3 hover:bg-muted/20"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-md ${transform.applied ? "bg-primary/10 text-primary" : "bg-muted"}`}
                      >
                        <Wand2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{transform.type}</div>
                        <div className="text-sm text-muted-foreground">{transform.description}</div>
                      </div>
                    </div>
                    <Button
                      variant={transform.applied ? "default" : "outline"}
                      size="sm"
                      onClick={() => applyTransformation(transform.id)}
                    >
                      {transform.applied ? (
                        <>
                          <Check className="mr-1 h-4 w-4" />
                          Applied
                        </>
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Custom Transformation
              </Button>
              <Button onClick={() => setActiveTab("output")}>
                Continue to Output
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="output" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Transformed Data</CardTitle>
              <CardDescription>Your data after applying transformations</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea value={outputData} readOnly className="min-h-[300px] font-mono text-sm" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownloadData}>
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
                <Button variant="outline">
                  <TableIcon className="mr-2 h-4 w-4" />
                  Export to Excel
                </Button>
              </div>
              <Button onClick={() => setActiveTab("visualization")}>
                Visualize Data
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Data Summary</CardTitle>
              <CardDescription>Statistical summary of your transformed data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground">Total Rows</div>
                  <div className="text-2xl font-bold mt-1">12</div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground">Total Columns</div>
                  <div className="text-2xl font-bold mt-1">5</div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="text-sm text-muted-foreground">Total Sales</div>
                  <div className="text-2xl font-bold mt-1">$155,100</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Data Visualization</CardTitle>
                <CardDescription>Visual representation of your data</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <canvas ref={canvasRef} width={600} height={400} className="border rounded-md bg-card"></canvas>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleDownloadVisualization}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Select value={visualizationType} onValueChange={setVisualizationType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={renderVisualization}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>AI Visualization</CardTitle>
                <CardDescription>Generate visualizations with AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="viz-prompt">Visualization Prompt</Label>
                  <Textarea
                    id="viz-prompt"
                    placeholder="Describe the visualization you want (e.g., 'Show me sales by region as a bar chart')"
                    value={visualizationPrompt}
                    onChange={(e) => setVisualizationPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <Button
                  onClick={handleGenerateVisualization}
                  disabled={isGeneratingVisualization || !visualizationPrompt.trim() || !outputData}
                  className="w-full"
                >
                  {isGeneratingVisualization ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Visualization
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {generatedCode && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Generated Code</CardTitle>
                <CardDescription>Code for the AI-generated visualization</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-muted/20">
                  <pre className="font-mono text-sm">{generatedCode}</pre>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={handleSaveCode}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Code
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

