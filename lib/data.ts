// Mock data functions - in a real app, these would connect to a database

// Hidden Super Admin user (not returned in regular user lists)
const superAdminUser = {
  id: "1",
  name: "Super Admin",
  email: "super@acumant.com",
  role: "superAdmin", // Acumant team member with full access
  status: "active",
  organizationId: "acumant",
}

// User data visible to the UI
const mockUsers = [
  {
    id: "2",
    name: "Customer Admin",
    email: "admin@customer1.com",
    role: "admin", // Customer admin with limited access
    status: "active",
    organizationId: "customer1",
  },
  {
    id: "3",
    name: "John Doe",
    email: "john@customer1.com",
    role: "user",
    status: "active",
    organizationId: "customer1",
  },
  {
    id: "4",
    name: "Jane Smith",
    email: "jane@customer2.com",
    role: "user",
    status: "active",
    organizationId: "customer2",
  },
  {
    id: "5",
    name: "Bob Johnson",
    email: "bob@customer2.com",
    role: "user",
    status: "inactive",
    organizationId: "customer2",
  },
]

// Organization data
const mockOrganizations = [
  {
    id: "acumant",
    name: "Acumant",
    subscription: "enterprise",
    status: "active",
    logo: "/images/acumant-logo.png",
  },
  {
    id: "customer1",
    name: "Customer One Inc.",
    subscription: "premium",
    status: "active",
    logo: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "customer2",
    name: "Customer Two LLC",
    subscription: "standard",
    status: "active",
    logo: null,
  },
]

// Tool data
const mockTools = [
  {
    id: "1",
    name: "Chat",
    description: "AI-powered chat assistant for answering questions and providing support",
    slug: "chat",
    isActive: true,
  },
  {
    id: "2",
    name: "Data Formulator",
    description: "Transform and analyze data with AI assistance",
    slug: "data-formulator",
    isActive: true,
  },
  {
    id: "3",
    name: "Deep Research",
    description: "Conduct in-depth research and analysis on any topic",
    slug: "deep-research",
    isActive: true,
  },
]

// Organization-tool access mapping (which tools are enabled for which organizations)
const mockOrganizationTools = {
  acumant: ["1", "2", "3"], // Acumant has access to all tools
  customer1: ["1", "2", "3"], // Customer One has access to all tools
  customer2: ["1"], // Customer Two has access to Chat only
}

// User-tool access mapping (which tools are enabled for which users)
const mockUserTools = {
  "1": ["1", "2", "3"], // Super Admin has access to all tools
  "2": ["1", "2", "3"], // Customer Admin has access to all tools
  "3": ["1", "2", "3"], // John has access to all tools
  "4": ["1"], // Jane has access to Chat only
  "5": ["1"], // Bob has access to Chat only
}

// Settings data
const mockSettings = {
  // Fixed platform information (managed by Acumant)
  platformName: "Acumant Tools", // Fixed - not editable by customers
  platformDescription: "Enterprise tools platform", // Fixed - not editable by customers
  supportEmail: "support@acumant.com", // Fixed - not editable by customers

  // Customer-configurable settings
  logo: "/images/acumant-logo.png",
  primaryColor: "#0f172a",
  accentColor: "#3b82f6",
  models: {
    chat: "gpt-4o",
    deepResearch: "gpt-4o",
  },
  apiKeys: {
    openai: "sk-***************************",
    anthropic: "sk-ant-*********************",
    pinecone: "***************************",
  },
}

// Get current user
export async function getCurrentUser() {
  // In a real app, this would check the session
  return superAdminUser // Return super admin user for demo
}

// Get all users
export async function getUsers() {
  return mockUsers
}

// Get users for a specific organization
export async function getOrganizationUsers(organizationId: string) {
  return mockUsers.filter((user) => user.organizationId === organizationId)
}

// Get all organizations
export async function getOrganizations() {
  return mockOrganizations
}

// Get organization by ID
export async function getOrganization(id: string) {
  return mockOrganizations.find((org) => org.id === id)
}

export async function getOrganizationById(id: string) {
  return mockOrganizations.find((org) => org.id === id)
}

// Get all tools
export async function getAllTools() {
  return mockTools
}

// Get tools for a specific organization
export async function getOrganizationTools(organizationId: string) {
  const toolIds = mockOrganizationTools[organizationId as keyof typeof mockOrganizationTools] || []
  return mockTools.filter((tool) => toolIds.includes(tool.id))
}

// Get tools for a specific user
export async function getUserTools(userId: string) {
  const toolIds = mockUserTools[userId as keyof typeof mockUserTools] || []
  return mockTools.filter((tool) => toolIds.includes(tool.id))
}

// Update organization tools
export async function updateOrganizationTools(organizationId: string, toolIds: string[]) {
  // In a real app, this would update the database
  mockOrganizationTools[organizationId as keyof typeof mockOrganizationTools] = toolIds
  return true
}

// Update user tools
export async function updateUserTools(userId: string, toolIds: string[]) {
  // In a real app, this would update the database
  mockUserTools[userId as keyof typeof mockUserTools] = toolIds
  return true
}

// Get settings
export async function getSettings() {
  return mockSettings
}

// Check if user is a super admin
export function isSuperAdmin(user: any) {
  return user?.role === "superAdmin"
}

// Check if user is an admin (either super admin or customer admin)
export function isAdmin(user: any) {
  return user?.role === "superAdmin" || user?.role === "admin"
}

