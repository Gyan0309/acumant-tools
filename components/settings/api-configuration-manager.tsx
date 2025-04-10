"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Key,
  Save,
  Loader2,
  ShieldCheck,
  Bot,
  Database,
  Search,
  AlertTriangle,
  Info,
  Check,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import api from "@/lib/api";


interface APIKey {
  name: string;
  apiKey: string;
  model: string;
  azureBaseUrl?: string | null;
  apiVersion?: string | null;
  isActive?: boolean | true;
  // lastUsed?: Date
}

interface ModelConfiguration {
  id: string;
  provider: string;
  model: string;
  toolId: string;
  isDefault: boolean;
}

interface Tool {
  id: string;
  name: string;
}

interface Provider {
  id: string;
  name: string;
}

interface Model {
  id: string;
  name: string;
}

interface ModelsByProvider {
  [providerId: string]: Model[];
}

interface ToolModelConfigProps {
  tool: Tool;
  config?: ModelConfiguration;
  providers: Provider[];
  modelsByProvider: ModelsByProvider;
  onSaveConfig: (
    toolId: string,
    provider: string,
    model: string
  ) => Promise<void>;
}

function ToolModelConfig({
  tool,
  config,
  providers,
  modelsByProvider,
  onSaveConfig,
}: ToolModelConfigProps) {
  const [selectedProvider, setSelectedProvider] = useState(
    config?.provider || "openai"
  );
  const [selectedModel, setSelectedModel] = useState(
    config?.model || modelsByProvider[selectedProvider]?.[0]?.id || ""
  );

  return (
    <div className="border rounded-md p-4">
      <div className="flex items-center gap-2 mb-4">
        {tool.id === "chat" && <Bot className="h-5 w-5 text-brand-teal" />}
        {tool.id === "data-formulator" && (
          <Database className="h-5 w-5 text-brand-teal" />
        )}
        {tool.id === "deep-research" && (
          <Search className="h-5 w-5 text-brand-teal" />
        )}
        <h3 className="text-lg font-medium">{tool.name}</h3>
        {config && (
          <Badge variant="outline" className="ml-auto">
            Current: {providers.find((p) => p.id === config.provider)?.name} -{" "}
            {
              modelsByProvider[config.provider]?.find(
                (m) => m.id === config.model
              )?.name
            }
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`provider-${tool.id}`}>AI Provider</Label>
          <Select
            defaultValue={config?.provider || "openai"}
            onValueChange={setSelectedProvider}
          >
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
            <Select
              defaultValue={
                config?.model ||
                modelsByProvider[selectedProvider]?.[0]?.id ||
                ""
              }
              onValueChange={setSelectedModel}
            >
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
            <Button
              onClick={() =>
                onSaveConfig(tool.id, selectedProvider, selectedModel)
              }
              className="shrink-0"
            >
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
            This tool doesn't have a model configured yet. Please select a
            provider and model.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export function APIConfigurationManager() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("api-keys");
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [modelConfigurations, setModelConfigurations] = useState<
    ModelConfiguration[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiVersion, setApiVersion] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [useKeyVault, setUseKeyVault] = useState(true);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [azureBaseUrl, setAzureBaseUrl] = useState('');
  const { toast } = useToast();

  // Mock data for tools
  const tools = [
    { id: "chat", name: "Chat" },
    { id: "data-formulator", name: "Data Formulator" },
    { id: "deep-research", name: "Deep Research" },
  ];

  // Mock data for providers
  // const providers = [
  //   { id: "openai", name: "OpenAI" },
  //   { id: "anthropic", name: "Anthropic" },
  //   { id: "azure-openai", name: "Azure OpenAI" },
  //   { id: "cohere", name: "Cohere" },
  // ];

  // Mock data for models by provider
  const modelsByProvider: Record<string, { id: string; name: string }[]> = {
    openai: [
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    ],
    anthropic: [
      { id: "claude-3-opus", name: "Claude 3 Opus" },
      { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
      { id: "claude-3-haiku", name: "Claude 3 Haiku" },
    ],
    "azure-openai": [
      { id: "azure-gpt-4", name: "Azure GPT-4" },
      { id: "azure-gpt-35-turbo", name: "Azure GPT-3.5 Turbo" },
    ],
    cohere: [
      { id: "command", name: "Command" },
      { id: "command-light", name: "Command Light" },
      { id: "command-r", name: "Command R" },
    ],
  };

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      try {
        const company_id = "AcumantTest";
        const response = await api.get(`/llm/company/${company_id}/llm-config`);
        // console.log("API Keys:", response.data);
        const providers = response.data.llmProviders;
        const apiKeyArray: APIKey[] = Object.entries(providers).map(
          ([providerName, config]) => {
            const typedConfig = config as APIKey;
            return {
              name: providerName,
              apiKey: typedConfig.apiKey,
              model: typedConfig.model,
              baseUrl: typedConfig.azureBaseUrl,
              apiVersion: typedConfig.apiVersion,
              isActive: true,
            };
          }
        );

        setApiKeys(apiKeyArray);

        // Mock model configurations
        const mockModelConfigurations: ModelConfiguration[] = [
          {
            id: "1",
            provider: "openai",
            model: "gpt-4o",
            toolId: "chat",
            isDefault: true,
          },
          {
            id: "2",
            provider: "anthropic",
            model: "claude-3-opus",
            toolId: "deep-research",
            isDefault: true,
          },
          {
            id: "3",
            provider: "openai",
            model: "gpt-4-turbo",
            toolId: "data-formulator",
            isDefault: true,
          },
        ];

        setModelConfigurations(mockModelConfigurations);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load configuration data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await api.get("/llm/providers");
        setProviders(response.data);
        // console.log("Providers:", response.data);
      } catch (error) {
        console.error("Error fetching providers:", error);
        toast({
          title: "Error",
          description: "Failed to load providers",
          variant: "destructive",
        });
      }
    };
    fetchProviders();
  }, [toast]);

  const handleAddApiKey = async () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a name and key value",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newKey: APIKey = {
        // id: Date.now().toString(),
        name: newKeyName,
        apiKey: newKeyValue,
        model: "null",
        azureBaseUrl: azureBaseUrl,
        apiVersion: null,
        isActive: true,
      };

      // console.log("New API Key:", newKey);

      setApiKeys((prev) => [...prev, newKey]);
      setNewKeyName("");
      setNewKeyValue("");

      toast({
        title: "API key added",
        description: useKeyVault
          ? "API key has been securely stored in Azure Key Vault"
          : "API key has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  //Leaving just for now
  const handleToggleKeyStatus = async (id: string) => {
    setApiKeys((prev) =>
      prev.map((key) =>
        key.name === id ? { ...key, isActive: !key.isActive } : key
      )
    );

    toast({
      title: "API key updated",
      description: "The API key status has been updated",
    });
  };

  const handleTestApiKey = async (id: string) => {
    setIsTesting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "API key is valid",
        description: "Successfully connected to the API service",
      });
    } catch (error) {
      toast({
        title: "API key validation failed",
        description: "Could not connect to the API service with this key",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleAddModelConfiguration = useCallback(
    async (toolId: string, provider: string, model: string) => {
      // Check if configuration already exists for this tool
      const existingConfig = modelConfigurations.find(
        (config) => config.toolId === toolId
      );

      if (existingConfig) {
        // Update existing configuration
        setModelConfigurations((prev) =>
          prev.map((config) =>
            config.toolId === toolId ? { ...config, provider, model } : config
          )
        );
      } else {
        // Add new configuration
        const newConfig: ModelConfiguration = {
          id: Date.now().toString(),
          provider,
          model,
          toolId,
          isDefault: true,
        };

        setModelConfigurations((prev) => [...prev, newConfig]);
      }

      toast({
        title: "Model configuration updated",
        description: `The model for ${
          tools.find((t) => t.id === toolId)?.name
        } has been updated`,
      });
    },
    [modelConfigurations, setModelConfigurations, toast, tools]
  );

  const handleSaveAllConfigurations = async () => {
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Configurations saved",
        description: "All API keys and model configurations have been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configurations",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.push("/settings");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-brand-blue">
            API & Model Configuration
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your API keys and AI model configurations for all tools in
            one place
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Model Configurations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-brand-teal" />
                API Keys Management
              </CardTitle>
              <CardDescription>
                Add and manage API keys for various AI providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-300">
                <Info className="h-4 w-4" />
                <AlertTitle>Secure Storage</AlertTitle>
                <AlertDescription>
                  API keys are securely stored in Azure Key Vault and are never
                  exposed in plaintext.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Your API Keys</h3>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="use-key-vault"
                      checked={useKeyVault}
                      onCheckedChange={setUseKeyVault}
                    />
                    <Label
                      htmlFor="use-key-vault"
                      className="text-sm cursor-pointer flex items-center gap-1"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-brand-teal" />
                      Use Azure Key Vault
                    </Label>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
                  </div>
                ) : apiKeys.length === 0 ? (
                  <div className="text-center py-8 border rounded-md bg-muted/20">
                    <Key className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      No API keys added yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {apiKeys.map((apiKey) => (
                      <div
                        key={apiKey.name} //changes id to name for now
                        className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{apiKey.name}</h4>
                            <Badge
                              variant={apiKey.isActive ? "success" : "warning"}
                              className="text-xs"
                            >
                              {apiKey.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm font-mono text-muted-foreground">
                              {apiKey.apiKey}
                            </p>
                            {/* {apiKey.lastUsed && (
                              <span className="text-xs text-muted-foreground">
                                Last used: {apiKey.lastUsed.toLocaleDateString()}
                              </span>
                            )} */}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestApiKey(apiKey.name)} //changes id to name for now
                            disabled={isTesting}
                            className="h-8 text-xs"
                          >
                            {isTesting ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                            ) : (
                              <RefreshCw className="h-3.5 w-3.5 mr-1" />
                            )}
                            Test
                          </Button>
                          <Button
                            variant={apiKey.isActive ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleToggleKeyStatus(apiKey.name)} //changes id to name for now
                            className="h-8 text-xs"
                          >
                            {apiKey.isActive ? "Disable" : "Enable"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Add New API Key</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* API Key Provider Dropdown */}
                    <div className="space-y-2">
                      <Label htmlFor="Provider">Provider</Label>
                      <Select
                        value={newKeyName}
                        onValueChange={(val) => setNewKeyName(val)}
                      >
                        <SelectTrigger id="Provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {providers.map((provider) => (
                            <SelectItem key={provider} value={provider}>
                              {provider.charAt(0).toUpperCase() +
                                provider.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* API Key Input */}
                    <div className="space-y-2">
                      <Label htmlFor="key-value">API Key</Label>
                      <Input
                        id="key-value"
                        type="password"
                        placeholder="Enter your API key"
                        value={newKeyValue}
                        onChange={(e) => setNewKeyValue(e.target.value)}
                      />
                    </div>

                    {/* Conditionally render Base URL for Azure */}
                    {newKeyName === "azure" && (
                      <div className="space-y-2">
                        <Label htmlFor="base-url">Base URL</Label>
                        <Input
                          id="base-url"
                          placeholder="Enter Azure base URL"
                          value={azureBaseUrl}
                          onChange={(e) => setAzureBaseUrl(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  {/* submit button */}
                  <Button
                    onClick={handleAddApiKey}
                    className="mt-4"
                    disabled={
                      isSaving || !newKeyName.trim() || !newKeyValue.trim()
                    }
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" />
                        Add API Key
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-brand-teal" />
                Model Configurations
              </CardTitle>
              <CardDescription>
                Configure which AI models to use for each tool
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
                </div>
              ) : (
                <div className="space-y-6">
                  {tools.map((tool) => (
                    <ToolModelConfig
                      key={tool.id}
                      tool={tool}
                      config={modelConfigurations.find(
                        (c) => c.toolId === tool.id
                      )}
                      providers={providers}
                      modelsByProvider={modelsByProvider}
                      onSaveConfig={handleAddModelConfiguration}
                    />
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveAllConfigurations}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Configurations...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save All Configurations
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
