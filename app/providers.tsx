"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/dashboard/sidebar-provider";
import { ScrollManager } from "@/components/dashboard/scroll-manager";

interface ProvidersProps {
  children: ReactNode;
  session?: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider>
          <ScrollManager />
          {children}
        </SidebarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
