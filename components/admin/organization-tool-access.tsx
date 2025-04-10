"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { getOrganizations, getAllTools, getOrganizationTools, updateOrganizationTools } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export function OrganizationToolAccess() {
  const [organizations, setOrganizations] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])
  const [selectedOrg, setSelectedOrg] = useState<string>("")
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgsData = await getOrganizations()
        setOrganizations(orgsData)
        const toolsData = await getAllTools()
        setTools(toolsData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchOrgTools = async () => {
      if (!selectedOrg) return

      try {
        const orgTools = await getOrganizationTools(selectedOrg)
        setSelectedTools(orgTools.map((tool) => tool.id))
      } catch (error) {
        console.error("Failed to fetch organization tools:", error)
      }
    }

    fetchOrgTools()
  }, [selectedOrg])

  const handleOrgChange = (orgId: string) => {
    setSelectedOrg(orgId)
  }

  const handleToolToggle = (toolId: string) => {
    setSelectedTools((prev) => (prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]))
  }

  const handleSave = async () => {
    if (!selectedOrg) return

    setIsLoading(true)
    try {
      await updateOrganizationTools(selectedOrg, selectedTools)
      toast({
        title: "Tools updated",
        description: "Organization tool access has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update organization tool access.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Tool Access</CardTitle>
        <CardDescription>Manage which tools are available to each customer organization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="org-select">Select Organization</Label>
            <Select value={selectedOrg} onValueChange={handleOrgChange}>
              <SelectTrigger id="org-select" className="w-full md:w-[300px]">
                <SelectValue placeholder="Select an organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                    {org.id === "acumant" && (
                      <Badge variant="outline" className="ml-2">
                        Acumant
                      </Badge>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedOrg && (
            <>
              <div className="space-y-4">
                <Label>Available Tools</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tools.map((tool) => (
                    <div key={tool.id} className="flex items-start space-x-2 border p-3 rounded-md">
                      <Checkbox
                        id={`tool-${tool.id}`}
                        checked={selectedTools.includes(tool.id)}
                        onCheckedChange={() => handleToolToggle(tool.id)}
                      />
                      <div className="grid gap-1.5">
                        <Label htmlFor={`tool-${tool.id}`} className="font-medium cursor-pointer">
                          {tool.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

