"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser, isSuperAdmin, getOrganizations, getAllTools } from "@/lib/data"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useRouter } from "next/navigation"
import { Building, Loader2, Plus, Package, Users, CreditCard, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock subscription plans data
const mockSubscriptionPlans = [
  {
    id: "1",
    name: "Standard",
    description: "Basic access to essential tools",
    price: 99,
    billingCycle: "monthly",
    isActive: true,
    tools: ["1"],
    type: "standard",
  },
  {
    id: "2",
    name: "Premium",
    description: "Advanced access with priority support",
    price: 199,
    billingCycle: "monthly",
    isActive: true,
    tools: ["1", "2"],
    type: "premium",
  },
  {
    id: "3",
    name: "Enterprise",
    description: "Full access to all tools with dedicated support",
    price: 499,
    billingCycle: "monthly",
    isActive: true,
    tools: ["1", "2", "3"],
    type: "enterprise",
  },
  {
    id: "4",
    name: "Developer Pro",
    description: "Custom plan for development teams",
    price: 299,
    billingCycle: "monthly",
    isActive: true,
    tools: ["1", "3"],
    type: "custom",
  },
]

export default function SubscriptionManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [organizations, setOrganizations] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<string>("plans")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await getCurrentUser()
        if (!userData) {
          router.push("/login")
          return
        }

        // Only super admins can access this page
        if (!isSuperAdmin(userData)) {
          router.push("/dashboard")
          return
        }

        setUser(userData)

        const orgsData = await getOrganizations()
        setOrganizations(orgsData)

        const toolsData = await getAllTools()
        setTools(toolsData)

        // In a real app, you would fetch subscription plans from the database
        setSubscriptionPlans(mockSubscriptionPlans)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleCreatePlan = () => {
    router.push("/subscription-management/create")
  }

  const handleEditPlan = (planId: string) => {
    router.push(`/subscription-management/edit/${planId}`)
  }

  const handleDeletePlan = (planId: string) => {
    // In a real app, you would show a confirmation dialog and delete the plan
    toast({
      title: "Delete Plan",
      description: `Deleting plan ${planId} (not implemented)`,
      variant: "destructive",
    })
  }

  const handleManageOrganization = (orgId: string) => {
    router.push(`/subscription-management/${orgId}`)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader user={user || {}} />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />

      <main className="flex-1 container py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-brand-blue">
              Subscription Management
            </h1>
            <p className="text-muted-foreground mt-1">Manage subscription plans and organization access</p>
          </div>

          <Button
            onClick={handleCreatePlan}
            className="gap-1 bg-gradient-to-r from-brand-teal to-brand-blue hover:from-brand-teal/90 hover:to-brand-blue/90 self-start"
          >
            <Plus className="h-4 w-4" />
            Create Plan
          </Button>
        </div>

        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "plans"
                ? "border-b-2 border-brand-teal text-brand-teal"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("plans")}
          >
            Subscription Plans
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "organizations"
                ? "border-b-2 border-brand-teal text-brand-teal"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("organizations")}
          >
            Organizations
          </button>
        </div>

        {activeTab === "plans" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-brand-teal" />
                Subscription Plans
              </CardTitle>
              <CardDescription>Manage available subscription plans</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Billing</TableHead>
                    <TableHead>Tools</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptionPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-sm text-muted-foreground">{plan.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>${plan.price}</TableCell>
                      <TableCell className="capitalize">{plan.billingCycle}</TableCell>
                      <TableCell>{plan.tools.length} tools</TableCell>
                      <TableCell>
                        <Badge variant={plan.isActive ? "success" : "outline"}>
                          {plan.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditPlan(plan.id)}
                            className="hover:bg-gradient-to-r hover:from-brand-teal/10 hover:to-brand-blue/10 hover:text-brand-teal hover:border-brand-teal/30"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeletePlan(plan.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === "organizations" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-brand-teal" />
                Organizations
              </CardTitle>
              <CardDescription>Manage organization subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {organizations.map((org) => (
                  <div key={org.id} className="border rounded-lg p-4 hover:border-brand-teal/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 relative border rounded-md bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                        {org.logo ? (
                          <Image
                            src={org.logo || "/placeholder.svg"}
                            alt={org.name}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        ) : (
                          <Building className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{org.name}</h3>
                        <Badge variant={org.status === "active" ? "success" : "outline"} className="mt-1">
                          {org.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subscription:</span>
                        <span className="font-medium capitalize">{org.subscription}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Users:</span>
                        <span className="font-medium">
                          <Users className="h-3.5 w-3.5 inline mr-1" />
                          {org.id === "acumant" ? "5" : org.id === "customer1" ? "3" : "2"}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full transition-all hover:bg-gradient-to-r hover:from-brand-teal/10 hover:to-brand-blue/10 hover:text-brand-teal hover:border-brand-teal/30"
                      onClick={() => handleManageOrganization(org.id)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Manage Subscription
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

