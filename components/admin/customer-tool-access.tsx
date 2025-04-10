"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { getUsers, getAllTools, getUserTools, updateUserTools } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

export function CustomerToolAccess() {
  const [users, setUsers] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers()
        setUsers(usersData.filter((user) => user.role !== "admin"))
        const toolsData = await getAllTools()
        setTools(toolsData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchUserTools = async () => {
      if (!selectedUser) return

      try {
        const userTools = await getUserTools(selectedUser)
        setSelectedTools(userTools.map((tool) => tool.id))
      } catch (error) {
        console.error("Failed to fetch user tools:", error)
      }
    }

    fetchUserTools()
  }, [selectedUser])

  const handleUserChange = (userId: string) => {
    setSelectedUser(userId)
  }

  const handleToolToggle = (toolId: string) => {
    setSelectedTools((prev) => (prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]))
  }

  const handleSave = async () => {
    if (!selectedUser) return

    setIsLoading(true)
    try {
      await updateUserTools(selectedUser, selectedTools)
      toast({
        title: "Tools updated",
        description: "User tool access has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user tool access.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Tool Access</CardTitle>
        <CardDescription>Manage which tools are available to each customer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="user-select">Select Customer</Label>
            <Select value={selectedUser} onValueChange={handleUserChange}>
              <SelectTrigger id="user-select" className="w-full md:w-[300px]">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedUser && (
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

