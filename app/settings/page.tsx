"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useRouter } from "next/navigation";
import { ProfileSettings } from "@/components/admin/profile-settings";
import { Key, Settings, ChevronRight } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  useEffect(() => {
    const loadData = async () => {
      try {
        if (status === "loading") return;

        if (status === "unauthenticated") {
          console.log("status", status, session);
          signIn();
          return;
        }

        if (session?.user) {
          setUser(session?.user);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [session, status]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/20 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const navigateToApiConfig = () => {
    router.push("/settings/api-configuration");
  };

  const navigateToGeneralSettings = () => {
    router.push("/settings/general");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />

      <main className="flex-1 container py-10 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={navigateToApiConfig}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-brand-teal" />
                API & Model Configuration
              </CardTitle>
              <CardDescription>
                Manage API keys and AI model settings for all tools
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Configure OpenAI, Anthropic, and other API providers
              </p>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={navigateToGeneralSettings}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-brand-teal" />
                General Settings
              </CardTitle>
              <CardDescription>Manage application preferences</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Theme, notifications, and language preferences
              </p>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        <ProfileSettings user={user} />
      </main>
    </div>
  );
}
