"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useRouter } from "next/navigation";
import { EmbeddedDataFormulator } from "@/components/tools/embedded-data-formulator";
import { useSession, signIn } from "next-auth/react";
export default function DataFormulatorPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

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
    const preserveScrollEvent = new CustomEvent(
      "preserveScroll:dataFormulator"
    );
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
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader user={user} />
      <main className="flex-1 p-0">
        <EmbeddedDataFormulator />
      </main>
    </div>
  );
}
