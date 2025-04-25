"use client";

import { useState, useEffect } from "react";
import { EnhancedChatInterface } from "@/components/tools/enhanced-chat-interface";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Bot, MessageSquare, Settings, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  // Load user data and prevent scroll
  useEffect(() => {
    const loadData = async () => {
      try {
        if (status === "loading") return;

        if (status === "unauthenticated") {
          signIn();
          return;
        }

        setUser(session?.user);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Create a custom event for this specific page
    const preserveScrollEvent = new CustomEvent("preserveScroll:chat");
    document.dispatchEvent(preserveScrollEvent);

    // Prevent scroll to top on navigation using multiple techniques
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition) {
      // Use requestAnimationFrame for smoother scroll restoration
      requestAnimationFrame(() => {
        window.scrollTo(0, Number.parseInt(scrollPosition, 10));

        // Add a backup in case the first attempt fails
        requestAnimationFrame(() => {
          window.scrollTo(0, Number.parseInt(scrollPosition, 10));
        });
      });
    }

    // Return cleanup function
    return () => {
      // Save position when leaving the page
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    };
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

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />

      <main className="flex-1 container py-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-start gap-2 mb-1">
            <MessageSquare className="h-8 w-8 text-brand-teal mt-1" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight gradient-text">
                AI Assistant
              </h1>
              <p className="text-muted-foreground">
                Interact with AI to get answers, generate content, and more
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-brand-teal/10 text-brand-teal"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              AI-Powered
            </Badge>
            <Badge variant="outline" className="bg-primary/10">
              <Bot className="h-3.5 w-3.5 mr-1.5" />
              GPT-4o
            </Badge>
          </div>
        </div>

        <EnhancedChatInterface />
      </main>
    </div>
  );
}
