"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Bot, Database, Search, AlertTriangle, Check } from "lucide-react"

interface Tool {
  id: string
  name: string
}

interface ModelConfig {
  id: string
  provider: string
  model: string
  toolId: string
  isDefault: boolean
}

interface Provider {
  id: string
  name: string
}

interface Model {
  id: string
  name: string
}

interface ToolModelConfigProps {
  tool: Tool
  config: ModelConfig | undefined
  providers: Provider[]
  modelsByProvider: Record<string, Model[]>
  onSaveConfig: (toolId: string, provider: string, model: string) => void
}

export function ToolModelConfig({ tool, config, providers, modelsByProvider, onSaveConfig }: ToolModelConfigProps) {
  const [selectedProvider, setSelectedProvider] = useState(config?.provider || "openai")
  const [selectedModel, setSelectedModel] = useState(config?.model || modelsByProvider[selectedProvider]?.[0]?.id || "")

  // Update selected model when provider changes
  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider)
    // Set default model for the new provider
    const defaultModel = modelsByProvider[provider]?.[0]?.id || ""
    setSelectedModel(defaultModel)
  }

  const getToolIcon = () => {
    switch (tool.id) {
      case "chat":
        return <Bot className="h-5 w-5 text-brand-teal" />
      case "data-formulator":
        return <Database className="h-5 w-5 text-brand-teal" />
      case "deep-research":
        return <Search className="h-5 w-5 text-brand-teal" />
      default:
        return <Bot className="h-5 w-5 text-brand-teal" />
    }
  }

  return (
    <div className="border rounded-md p-4">
      <div className="flex items-center gap-2 mb-4">
        {getToolIcon()}
        <h3 className="text-lg font-medium">{tool.name}</h3>
        {config && (
          <Badge variant="outline" className="ml-auto">
            Current: {providers.find((p) => p.id === config.provider)?.name} -{" "}
            {modelsByProvider[config.provider]?.find((m) => m.id === config.model)?.name}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`provider-${tool.id}`}>AI Provider</Label>
          <Select value={selectedProvider} onValueChange={handleProviderChange}>
            <SelectTrigger id={`provider-${tool.id}`}>
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {providers.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`model-${tool.id}`}>AI Model</Label>
          <div className="flex gap-2">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger id={`model-${tool.id}`} className="flex-1">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {modelsByProvider[selectedProvider]?.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => onSaveConfig(tool.id, selectedProvider, selectedModel)} className="shrink-0">
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {!config && (
        <Alert className="mt-4 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50 text-yellow-800 dark:text-yellow-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No model configured</AlertTitle>
          <AlertDescription>
            This tool doesn't have a model configured yet. Please select a provider and model.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

