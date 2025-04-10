"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Settings, Plus, ChevronDown, RotateCcw, Power, TableIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function DataFormulatorInterface() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [modelSelected, setModelSelected] = useState(false)
  const [tableAdded, setTableAdded] = useState(false)
  const [activeTab, setActiveTab] = useState("table1")
  const { toast } = useToast()

  const handleSelectModel = () => {
    setModelSelected(true)
    toast({
      title: "Model Selected",
      description: "GPT-4o model has been selected for data formulation",
    })
  }

  const handleAddTable = () => {
    if (!modelSelected) {
      toast({
        title: "Select a model first",
        description: "Please select an AI model before adding a table",
        variant: "destructive",
      })
      return
    }

    setTableAdded(true)
    toast({
      title: "Table Added",
      description: "New table has been added to your session",
    })
  }

  const handleResetSession = () => {
    setModelSelected(false)
    setTableAdded(false)
    toast({
      title: "Session Reset",
      description: "Your data formulator session has been reset",
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4 container">
          <h1 className="text-lg font-semibold">Data Formulator</h1>

          <div className="ml-auto flex items-center gap-2">
            <div className="border rounded-md flex">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-none ${viewMode === "grid" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-none ${viewMode === "list" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>

            <Button variant={modelSelected ? "outline" : "default"} className="ml-2" onClick={handleSelectModel}>
              {modelSelected ? "GPT-4o" : "Select A Model"}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2" disabled={!modelSelected}>
                  Add Table <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleAddTable}>
                  <TableIcon className="mr-2 h-4 w-4" />
                  New Table
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" />
                  Import CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2">
                  Session <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Save Session</DropdownMenuItem>
                <DropdownMenuItem>Load Session</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" className="ml-2" onClick={handleResetSession}>
              <RotateCcw className="mr-2 h-4 w-4" />
              RESET SESSION
            </Button>

            <Button variant="ghost" size="icon">
              <Power className="h-4 w-4" />
              <span className="sr-only">Power</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {!modelSelected ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-3xl font-bold mb-4">Data Formulator</h2>
            <p className="text-xl mb-6">
              Let's{" "}
              <Button variant="link" className="p-0 h-auto text-xl" onClick={handleSelectModel}>
                Select A Model
              </Button>
            </p>
            <p className="text-muted-foreground">Specify an OpenAI or Azure OpenAI endpoint to run Data Formulator.</p>
          </div>
        ) : !tableAdded ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-3xl font-bold mb-4">Data Formulator</h2>
            <p className="text-xl mb-6">
              Let's{" "}
              <Button variant="link" className="p-0 h-auto text-xl" onClick={handleAddTable}>
                Add a Table
              </Button>
            </p>
            <p className="text-muted-foreground">Add a new table or import data to begin formulating.</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="table1">Table 1</TabsTrigger>
                <TabsTrigger value="add" onClick={() => handleAddTable()}>
                  <Plus className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  Share
                </Button>
              </div>
            </div>

            <TabsContent value="table1" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Table 1</CardTitle>
                  <CardDescription>Use natural language to transform your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4 h-[400px] flex items-center justify-center">
                      <div className="text-center">
                        <TableIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Import or add data to this table</p>
                        <Button className="mt-4">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Data
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-md p-4 h-[400px] flex flex-col">
                      <h3 className="font-medium mb-2">Data Formulation</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Describe how you want to transform your data using natural language
                      </p>
                      <textarea
                        className="flex-1 p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Example: 'Filter rows where sales > 1000 and group by region'"
                      ></textarea>
                      <Button className="mt-4 w-full">Formulate Data</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

