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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getOrganizationById,
  isSuperAdmin,
  getAllTools,
  getOrganizationTools,
} from "@/lib/data";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useRouter, useParams } from "next/navigation";
import { Building, Loader2, ArrowLeft, Save, CreditCard } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useSession, signIn } from "next-auth/react";

export default function ManageSubscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [organization, setOrganization] = useState<any>(null);
  const [tools, setTools] = useState<any[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [subscription, setSubscription] = useState<string>("standard");
  const [orgStatus, setOrgStatus] = useState<string>("active");
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

        const orgId = params.id as string;
        const orgData = await getOrganizationById(orgId);
        setOrganization(orgData);
        setSubscription(orgData.subscription || "standard");
        setOrgStatus(orgData.status || "active");

        const toolsData = await getAllTools();
        setTools(toolsData);

        const orgToolsData = await getOrganizationTools(orgId);
        setSelectedTools(orgToolsData.map((tool) => tool.id));
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [session, status, router, params.id]);

  const handleToolToggle = (toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would save the changes to the database
      // await updateOrganizationSubscription(organization.id, {
      //   subscription,
      //   status,
      //   tools: selectedTools
      // })

      toast({
        title: "Changes saved",
        description: "The subscription has been updated successfully.",
      });

      router.push("/subscription-management");
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
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
            className="gap-1 mr-4 transition-all hover:bg-gradient-to-r hover:from-brand-teal/10 hover:to-brand-blue/10 hover:text-brand-teal hover:border-brand-teal/30"
            onClick={() => router.push("/subscription-management")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-brand-blue">
              Manage Subscription
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure subscription details and tool access
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-brand-teal" />
                  Organization
                </CardTitle>
                <CardDescription>Organization details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="h-20 w-20 relative border rounded-md bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden mb-4">
                    {organization.logo ? (
                      <Image
                        src={organization.logo || "/placeholder.svg"}
                        alt={organization.name}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    ) : (
                      <Building className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-xl font-medium">{organization.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {organization.email || "No email provided"}
                  </p>

                  {organization.id === "acumant" && (
                    <Badge variant="outline" className="mt-3">
                      Acumant
                    </Badge>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Subscription Plan
                    </label>
                    <Select
                      value={subscription}
                      onValueChange={setSubscription}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
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
                    <label className="text-sm font-medium">Status</label>
                    <Select value={orgStatus} onValueChange={setOrgStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
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
                  Configure which tools this organization can access
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
                            <Building className="h-5 w-5 text-brand-teal" />
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
                  className="transition-all hover:bg-gradient-to-r hover:from-brand-teal/10 hover:to-brand-blue/10 hover:text-brand-teal hover:border-brand-teal/30"
                  onClick={() => router.push("/subscription-management")}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="gap-1 bg-gradient-to-r from-brand-teal to-brand-blue hover:from-brand-teal/90 hover:to-brand-blue/90 transition-all hover:bg-gradient-to-r hover:from-brand-teal/10 hover:to-brand-blue/10 hover:text-brand-teal hover:border-brand-teal/30"
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
