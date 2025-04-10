"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateModelSettings } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

interface ModelSelectorProps {
  toolId: string
  currentModel: string
}

export function ModelSelector({ toolId, currentModel }: ModelSelectorProps) {
  const [model, setModel] = useState(currentModel)
  const { toast } = useToast()

  const handleModelChange = async (value: string) => {
    setModel(value)
    try {
      await updateModelSettings(toolId, value)
      toast({
        title: "Model updated",
        description: "The AI model has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the model.",
        variant: "destructive",
      })
    }
  }

  return (
    <Select value={model} onValueChange={handleModelChange}>
      <SelectTrigger className="w-full md:w-[300px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
        <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
      </SelectContent>
    </Select>
  )
}

