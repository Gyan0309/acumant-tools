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
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, CreditCard, Plus, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useSession, signIn } from "next-auth/react";

export default function CreateSubscriptionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [tools, setTools] = useState<any[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [planType, setPlanType] = useState<string>("standard");
  const [planName, setPlanName] = useState<string>("");
  const [planDescription, setPlanDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [billingCycle, setBillingCycle] = useState<string>("monthly");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

        // Set default plan name based on type
        if (planType === "standard") {
          setPlanName("Standard");
          setPlanDescription("Basic access to essential tools");
          setPrice("99");
        } else if (planType === "premium") {
          setPlanName("Premium");
          setPlanDescription("Advanced access with priority support");
          setPrice("199");
        } else if (planType === "enterprise") {
          setPlanName("Enterprise");
          setPlanDescription("Full access to all tools with dedicated support");
          setPrice("499");
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [session, status]);

  // Update default values when plan type changes
  useEffect(() => {
    if (planType === "standard") {
      setPlanName("Standard");
      setPlanDescription("Basic access to essential tools");
      setPrice("99");
    } else if (planType === "premium") {
      setPlanName("Premium");
      setPlanDescription("Advanced access with priority support");
      setPrice("199");
    } else if (planType === "enterprise") {
      setPlanName("Enterprise");
      setPlanDescription("Full access to all tools with dedicated support");
      setPrice("499");
    } else if (planType === "custom") {
      setPlanName("");
      setPlanDescription("");
      setPrice("");
    }
  }, [planType]);

  const handleToolToggle = (toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleSave = async () => {
    if (planType === "custom" && !planName) {
      toast({
        title: "Error",
        description: "Please provide a name for the subscription plan.",
        variant: "destructive",
      });
      return;
    }

    if (!price) {
      toast({
        title: "Error",
        description: "Please provide a price for the subscription plan.",
        variant: "destructive",
      });
      return;
    }

    if (selectedTools.length === 0) {
      toast({
        title: "Error",
        description:
          "Please select at least one tool for this subscription plan.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would save the changes to the database
      // await createSubscriptionPlan({
      //   type: planType,
      //   name: planName,
      //   description: planDescription,
      //   price: parseFloat(price),
      //   billingCycle,
      //   isActive,
      //   tools: selectedTools
      // })

      toast({
        title: "Subscription plan created",
        description: "The subscription plan has been created successfully.",
      });

      router.push("/subscription-management");
    } catch (error) {
      console.error("Failed to create subscription plan:", error);
      toast({
        title: "Error",
        description: "Failed to create subscription plan. Please try again.",
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
              Create Subscription Plan
            </h1>
            <p className="text-muted-foreground mt-1">
              Define a new subscription plan that organizations can subscribe to
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
                  Configure the subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Plan Type</label>
                    <Select value={planType} onValueChange={setPlanType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Plan Name</label>
                    <Input
                      placeholder="Enter plan name"
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                      disabled={planType !== "custom"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Plan Description
                    </label>
                    <Textarea
                      placeholder="Enter plan description"
                      value={planDescription}
                      onChange={(e) => setPlanDescription(e.target.value)}
                      rows={3}
                      disabled={planType !== "custom"}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Billing Cycle</label>
                    <Select
                      value={billingCycle}
                      onValueChange={setBillingCycle}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select billing cycle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="text-sm font-medium">Active</label>
                    <Switch checked={isActive} onCheckedChange={setIsActive} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-brand-teal" />
                  Tool Access
                </CardTitle>
                <CardDescription>
                  Configure which tools are included in this subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tools.map((tool) => (
                    <div
                      key={tool.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:border-brand-teal/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-gradient-to-br from-brand-teal/10 to-brand-blue/10 dark:from-brand-teal/20 dark:to-brand-blue/20">
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
                    <Plus className="h-4 w-4" />
                  )}
                  Create Plan
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
