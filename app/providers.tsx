"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/dashboard/sidebar-provider"
import { ScrollManager } from "@/components/dashboard/scroll-manager"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        <ScrollManager />
        {children}
      </SidebarProvider>
    </ThemeProvider>
  )
}

