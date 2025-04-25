import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelSelector } from "@/components/admin/model-selector";
import { LogoUploader } from "@/components/admin/logo-uploader";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSettings } from "@/lib/data";
import { ProfileSettings } from "@/components/admin/profile-settings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user || (user.role !== "admin" && user.role !== "superAdmin")) {
    redirect("/");
  }

  const settings = await getSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />

      <main className="flex-1 container py-10 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Platform Settings</h1>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Branding</TabsTrigger>
            <TabsTrigger value="models">AI Models</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettings user={user} />
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="card-hover shadow-soft">
              <CardHeader>
                <CardTitle>Branding Settings</CardTitle>
                <CardDescription>
                  Customize your organization's branding within the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <LogoUploader currentLogo={settings.logo} />
                </div>

                <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-300">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Platform Branding</AlertTitle>
                  <AlertDescription>
                    The platform name, description, and support email are
                    managed by Acumant and cannot be modified. You can customize
                    your organization's logo and appearance settings.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input
                      id="platform-name"
                      value="Acumant Tools"
                      disabled
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Managed by Acumant
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform-description">
                      Platform Description
                    </Label>
                    <Input
                      id="platform-description"
                      value="Enterprise tools platform"
                      disabled
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Managed by Acumant
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input
                      id="support-email"
                      value="support@acumant.com"
                      disabled
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Managed by Acumant
                    </p>
                  </div>
                </div>

                <Button>Save Branding Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models">
            <Card className="card-hover shadow-soft">
              <CardHeader>
                <CardTitle>AI Models</CardTitle>
                <CardDescription>
                  Configure AI models for different tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Chat Tool Model</Label>
                    <ModelSelector
                      toolId="chat"
                      currentModel={settings.models?.chat || "gpt-4o"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Deep Research Tool Model</Label>
                    <ModelSelector
                      toolId="deep-research"
                      currentModel={settings.models?.deepResearch || "gpt-4o"}
                    />
                  </div>
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card className="card-hover shadow-soft">
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage API keys for external services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <Input
                    id="openai-key"
                    type="password"
                    defaultValue={settings.apiKeys?.openai || ""}
                    placeholder="sk-..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                  <Input
                    id="anthropic-key"
                    type="password"
                    defaultValue={settings.apiKeys?.anthropic || ""}
                    placeholder="sk-ant-..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pinecone-key">Pinecone API Key</Label>
                  <Input
                    id="pinecone-key"
                    type="password"
                    defaultValue={settings.apiKeys?.pinecone || ""}
                  />
                </div>
                <Button>Save API Keys</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
