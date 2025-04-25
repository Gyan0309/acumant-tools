"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  Paperclip,
  Bot,
  Database,
  Sparkles,
  RotateCcw,
  FolderPlus,
  ImageIcon,
  Loader2,
  MessageSquare,
  ChevronDown,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: string[];
}

interface Project {
  ProjectId: string;
  IndexId: string;
  OrgName: string;
  ProjectName: string;
}

interface AIModel {
  id: string;
  name: string;
  description?: string;
  provider: string;
}

export function EnhancedChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<"project" | "external">("project");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [SelectedProjectName, setSelectedProjectName] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o");
  const [apiProvider, setApiProvider] = useState<string>("openai");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const company_id = "Acumant";
        const response = await api.get(
          "/codecraft/get-projects-by-company_id",
          {
            params: { company_id: company_id },
          }
        );
        console.log(response.data);
        setProjects(response.data.results);

        if (response.data.results.length > 0) {
          const firstProject = response.data.results[0];
          setSelectedProject(firstProject.ProjectId);
          setSelectedProjectName(firstProject.ProjectName);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: "Unable to load projects. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const aiModels: AIModel[] = [
    { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "openai" },
    { id: "claude-3-opus", name: "Claude 3 Opus", provider: "anthropic" },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "anthropic" },
  ];

  // Sample suggested questions for project-based chat
  const suggestedQuestions = {
    "hr-policy": [
      "What are the certification and wellness amounts for India and international locations?",
      "What expenses can be reimbursed under the wellness policy?",
      "Can you describe the maternity leave policy in India?",
      "What is my leave eligibility?",
      "How do I apply for parental leave?",
      "What is the work from home policy?",
    ],
    acumant: [
      "What is the expense reimbursement process?",
      "How do I submit my travel expenses?",
      "What are the approval limits for purchases?",
      "How do I access the finance portal?",
      "What's the policy for international travel expenses?",
      "How are bonuses calculated and distributed?",
    ],
    "it-security": [
      "What is our password policy?",
      "How do I report a security incident?",
      "What are the guidelines for using personal devices?",
      "How often should I update my password?",
      "What's our policy on AI tools and data security?",
      "How do we handle sensitive customer information?",
    ],
    onboarding: [
      "What documents do I need to submit?",
      "How do I set up my workstation?",
      "Who should I contact for IT support?",
      "What training do I need to complete?",
      "How do I access the company knowledge base?",
      "What AI tools are available for new employees?",
    ],
  };

  // AI trending topics for external AI chat
  const aiTrendingTopics = [
    "Explain the differences between GPT-4o and previous models",
    "How can I use AI to improve my productivity at work?",
    "What are the latest developments in multimodal AI?",
    "How is AI being used in my industry?",
    "What are the best practices for prompt engineering?",
    "How can I fine-tune an AI model for my specific use case?",
    "What ethical considerations should I keep in mind when using AI?",
    "How do I evaluate the quality and accuracy of AI outputs?",
  ];

  // Initial welcome message based on chat mode
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage =
        chatMode === "project"
          ? {
              id: "welcome",
              role: "assistant" as const,
              content:
                "Hello and welcome!\nI'm your virtual assistant, here to help you with your queries.\nHow can I assist you today?",
              timestamp: new Date(),
            }
          : {
              id: "welcome",
              role: "assistant" as const,
              content:
                "Hello! I'm your AI assistant powered by " +
                aiModels.find((m) => m.id === selectedModel)?.name +
                ".\nHow can I help you today?",
              timestamp: new Date(),
            };

      setMessages([welcomeMessage]);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    }
  }, [chatMode, selectedModel, messages.length]);

 
  // Update provider when model changes
  useEffect(() => {
    const model = aiModels.find((m) => m.id === selectedModel);
    if (model) {
      setApiProvider(model.provider);
    }
  }, [selectedModel]);

  const handleSendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setAttachments([]);
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      if (chatMode === "external") {
        const selectedModelData = aiModels.find((m) => m.id === selectedModel);
        if (!selectedModelData) throw new Error("Selected model not found");

        setIsTyping(true);
        const company_id = "AcumantTest";
        const response = await api.post(
          `/codecraft/company/${company_id}/chat`,
          {
            prompt: currentInput,
            provider: apiProvider,
            model: selectedModel,
            attachments: userMessage.attachments,
          }
        );
        console.log("API Response:", response.data);
        setIsTyping(false);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.data?.data?.response || "No response received.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Default behavior for "project" chat
        setIsTyping(true);
        console.log(SelectedProjectName);
        const response = await api.post(
          `/codecraft/pinecone/query-text-from-pinecone`,
          {
            index_name: SelectedProjectName,
            query_text: currentInput,
          }
        );
        setIsTyping(false);
        console.log(response.data);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.data?.results?.answer || "No answer found.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      console.error("Error getting AI response:", error);
      setIsTyping(false);
      const errorMessage =
        error.response?.data?.detail || "Failed to get response from AI chat";

      toast({
        title: "AI Chat Error",
        description: errorMessage,
        variant: "destructive",
      });

      const errorMessageObj: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: ` ${errorMessage}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatModeChange = (value: boolean) => {
    setChatMode(value ? "external" : "project");
    // Reset messages when switching modes
    setMessages([]);
    setShowSuggestions(true);
  };

  const handleSuggestedQuestionClick = (question: string) => {
    setInput(question);
  };

  const handleReset = () => {
    setMessages([]);
    setShowSuggestions(true);
  };

  const handleManageProjects = () => {
    router.push("/tools/chat/projects");
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, you would upload the file to a server and get a URL back
      // For this example, we'll just use a placeholder
      const newAttachments = Array.from(files).map(
        (file) => `/uploads/${file.name}`
      );
      setAttachments((prev) => [...prev, ...newAttachments]);

      toast({
        title: "File attached",
        description: `${files.length} file(s) attached successfully.`,
      });
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileNameFromPath = (path: string) => {
    return path.split("/").pop() || path;
  };
  const handleProjectSelect = (projectId: string) => {
    const selectedProject = projects.find(
      (project) => project.ProjectId === projectId
    );
    if (selectedProject) {
      setSelectedProjectName(selectedProject.ProjectName);
    }
  };
  // console.log("372", SelectedProjectName);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] border rounded-md overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
      {/* Header */}
      <div className="border-b p-4 flex flex-col gap-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">


        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                id="chat-mode"
                checked={chatMode === "external"}
                onCheckedChange={handleChatModeChange}
                className="data-[state=checked]:bg-brand-teal"
              />
              <Label htmlFor="chat-mode" className="text-sm cursor-pointer">
                {chatMode === "project" ? "Project Chat" : "External AI Chat"}
              </Label>
            </div>

            {chatMode === "external" && (
              <Badge
                variant="outline"
                className="bg-gradient-to-r from-brand-teal/10 to-brand-blue/10 text-brand-teal text-xs"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            )}
          </div>

          {chatMode === "project" ? (
  <div className="flex items-center gap-2">
    <div className="w-64">
      <Select
        value={selectedProject}
        onValueChange={(projectId) => {
          setSelectedProject(projectId);
          handleProjectSelect(projectId);
        }}
      >
        <SelectTrigger className="h-9 text-sm">
          <div className="flex items-center gap-2">
            <Database className="h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="Select a project" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem
              key={project.ProjectId}
              value={project.ProjectId}
              className="text-sm hover:bg-brand-teal/10 hover:text-brand-teal focus:bg-brand-teal/10 focus:text-brand-teal"
            >
              {project.ProjectName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1 hover:bg-brand-teal/10 hover:text-brand-teal hover:border-brand-teal/30 transition-colors"
            onClick={handleManageProjects}
          >
            <FolderPlus className="h-3.5 w-3.5" />
            <span className="text-xs">Manage</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Manage your projects</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
              onClick={handleReset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear chat history</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
) : (
  <div className="flex items-center gap-2">
    <div className="w-64">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-9 justify-between"
          >
            <div className="flex items-center gap-2 text-sm">
              <Bot className="h-3.5 w-3.5 text-muted-foreground" />
              {aiModels.find((m) => m.id === selectedModel)?.name || "Select model"}
            </div>
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <div className="p-2">
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">OpenAI</h4>
            {aiModels
              .filter((model) => model.provider === "openai")
              .map((model) => (
                <DropdownMenuItem
                  key={model.id}
                  className={`text-sm rounded-md ${selectedModel === model.id
                    ? "bg-brand-teal/10 text-brand-teal"
                    : ""}`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  {model.name}
                </DropdownMenuItem>
              ))}
          </div>
          <div className="p-2 border-t">
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">Anthropic</h4>
            {aiModels
              .filter((model) => model.provider === "anthropic")
              .map((model) => (
                <DropdownMenuItem
                  key={model.id}
                  className={`text-sm rounded-md ${selectedModel === model.id
                    ? "bg-brand-teal/10 text-brand-teal"
                    : ""}`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  {model.name}
                </DropdownMenuItem>
              ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
              onClick={handleReset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear chat history</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
)}

        </div>
      </div>

      {/* Chat messages container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <AnimatePresence>
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    {message.role === "assistant" ? (
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="AI"
                      />
                    ) : null}
                    <AvatarFallback
                      className={
                        message.role === "assistant"
                          ? "bg-brand-teal text-white"
                          : "bg-primary"
                      }
                    >
                      {message.role === "assistant" ? "AI" : "You"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="prose max-w-full text-sm dark:prose-invert [&_p]:mb-4">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>

                    {/* Display attachments if any */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700"
                          >
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs truncate">
                              {getFileNameFromPath(attachment)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-brand-teal text-white">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </AnimatePresence>

        {/* Suggested questions for project chat */}
        {chatMode === "project" && showSuggestions && messages.length <= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4"
          >
            <div className="flex items-center mb-2">
              <h3 className="text-sm font-medium">Suggested Questions</h3>
              <Badge
                variant="outline"
                className="ml-2 text-xs bg-brand-teal/10 text-brand-teal"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Project-specific
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQuestions[
                selectedProject as keyof typeof suggestedQuestions
              ]?.map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <Card
                    className="p-3 cursor-pointer hover:bg-brand-teal/10 hover:text-brand-teal hover:border-brand-teal/30 transition-colors border"
                    onClick={() => handleSuggestedQuestionClick(question)}
                  >
                    <p className="text-sm text-center">{question}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* AI Trending Topics for external AI chat */}
        {chatMode === "external" && showSuggestions && messages.length <= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4"
          >
            <div className="flex items-center mb-2">
              <h3 className="text-sm font-medium">AI Trending Topics</h3>
              <Badge
                variant="outline"
                className="ml-2 text-xs bg-gradient-to-r from-brand-blue/10 to-brand-purple/10 text-brand-blue"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {aiTrendingTopics.map((topic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <Card
                    className="p-3 cursor-pointer hover:bg-brand-blue/10 hover:text-brand-blue hover:border-brand-blue/30 transition-colors border"
                    onClick={() => handleSuggestedQuestionClick(topic)}
                  >
                    <p className="text-sm text-center">{topic}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t p-4 bg-white dark:bg-gray-900">
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full pl-2 pr-1 py-1"
              >
                <ImageIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs max-w-[100px] truncate">
                  {getFileNameFromPath(attachment)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0 hover:bg-brand-teal/10 hover:text-brand-teal hover:border-brand-teal/30 transition-colors"
                  onClick={handleFileUpload}
                >
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach a file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            multiple
          />

          <Input
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 focus-visible:ring-brand-teal/30 focus-visible:ring-offset-brand-teal/20"
          />

          <Button
            onClick={handleSendMessage}
            disabled={isLoading || (!input.trim() && attachments.length === 0)}
            className="flex-shrink-0 bg-brand-teal hover:bg-brand-teal/90 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>

        {/* Character count and model info */}
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <div>
            {input.length > 0 && <span>{input.length} characters</span>}
          </div>
          {chatMode === "external" && (
            <div className="flex items-center gap-1">
              <Bot className="h-3 w-3" />
              <span>
                {aiModels.find((m) => m.id === selectedModel)?.name} by{" "}
                {apiProvider}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
