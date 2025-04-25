"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isSuperAdmin, getAllTools } from "@/lib/data";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Save,
  Package,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useSession, signIn } from "next-auth/react";

// Mock subscription plans data - in a real app, this would come from your database
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
];

export default function EditSubscriptionPlanPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [tools, setTools] = useState<any[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [planType, setPlanType] = useState("standard");
  const [planPrice, setPlanPrice] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isActive, setIsActive] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (status === "loading") return;

        if (status === "unauthenticated") {
          signIn();
          return;
        }

        // Only super admins can access this page
        if (!isSuperAdmin(session?.user)) {
          router.push("/dashboard");
          return;
        }

        setUser(session?.user);

        const toolsData = await getAllTools();
        setTools(toolsData);

        // Load plan data
        const planId = params.id as string;
        const plan = mockSubscriptionPlans.find((p) => p.id === planId);

        if (!plan) {
          toast({
            title: "Plan not found",
            description:
              "The subscription plan you're trying to edit doesn't exist.",
            variant: "destructive",
          });
          router.push("/subscription-management");
          return;
        }

        // Populate form with plan data
        setPlanName(plan.name);
        setPlanDescription(plan.description);
        setPlanType(plan.type);
        setPlanPrice(plan.price.toString());
        setBillingCycle(plan.billingCycle);
        setIsActive(plan.isActive);
        setSelectedTools(plan.tools);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast({
          title: "Error",
          description: "Failed to load subscription plan data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [session, status, params.id, toast]);

  const handleToolToggle = (toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleSave = async () => {
    if (!planName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a plan name.",
        variant: "destructive",
      });
      return;
    }

    if (!planPrice || isNaN(Number(planPrice)) || Number(planPrice) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please provide a valid price greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (selectedTools.length === 0) {
      toast({
        title: "No tools selected",
        description: "Please select at least one tool for this plan.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would update the plan in your database
      // await updateSubscriptionPlan(params.id, {
      //   name: planName,
      //   description: planDescription,
      //   type: planType,
      //   price: Number(planPrice),
      //   billingCycle,
      //   isActive,
      //   tools: selectedTools
      // })

      toast({
        title: "Plan updated",
        description: "The subscription plan has been updated successfully.",
      });

      router.push("/subscription-management");
    } catch (error) {
      console.error("Failed to update plan:", error);
      toast({
        title: "Error",
        description:
          "Failed to update the subscription plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader user={user || {}} />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />

      <main className="flex-1 container py-10">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 mr-4"
            onClick={() => router.push("/subscription-management")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-brand-blue">
              Edit Subscription Plan
            </h1>
            <p className="text-muted-foreground mt-1">
              Modify an existing subscription plan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-brand-teal" />
                  Plan Details
                </CardTitle>
                <CardDescription>
                  Basic information about the subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plan-name">Plan Name</Label>
                  <Input
                    id="plan-name"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="Enter plan name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plan-description">Description</Label>
                  <Textarea
                    id="plan-description"
                    value={planDescription}
                    onChange={(e) => setPlanDescription(e.target.value)}
                    placeholder="Describe what this plan offers"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plan-type">Plan Type</Label>
                  <Select value={planType} onValueChange={setPlanType}>
                    <SelectTrigger id="plan-type">
                      <SelectValue placeholder="Select plan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="plan-price"
                      className="flex items-center gap-1"
                    >
                      <DollarSign className="h-4 w-4 text-brand-teal" />
                      Price
                    </Label>
                    <Input
                      id="plan-price"
                      value={planPrice}
                      onChange={(e) => setPlanPrice(e.target.value)}
                      placeholder="99"
                      type="number"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="billing-cycle"
                      className="flex items-center gap-1"
                    >
                      <Calendar className="h-4 w-4 text-brand-teal" />
                      Billing Cycle
                    </Label>
                    <Select
                      value={billingCycle}
                      onValueChange={setBillingCycle}
                    >
                      <SelectTrigger id="billing-cycle">
                        <SelectValue placeholder="Select billing cycle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="plan-active" className="cursor-pointer">
                    Plan Active
                  </Label>
                  <Switch
                    id="plan-active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-brand-teal" />
                  Included Tools
                </CardTitle>
                <CardDescription>
                  Select which tools are included in this subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tools.map((tool) => (
                    <div
                      key={tool.id}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                        selectedTools.includes(tool.id)
                          ? "border-brand-teal/50 bg-gradient-to-r from-brand-teal/5 to-brand-blue/5"
                          : "hover:border-brand-teal/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-md ${
                            selectedTools.includes(tool.id)
                              ? "bg-gradient-to-br from-brand-teal/20 to-brand-blue/20"
                              : "bg-muted"
                          }`}
                        >
                          {tool.icon || (
                            <Package className="h-5 w-5 text-brand-teal" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{tool.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={selectedTools.includes(tool.id)}
                        onCheckedChange={() => handleToolToggle(tool.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => router.push("/subscription-management")}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="gap-1 bg-gradient-to-r from-brand-teal to-brand-blue hover:from-brand-teal/90 hover:to-brand-blue/90"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
