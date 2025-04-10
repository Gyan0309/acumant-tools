"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useRouter } from "next/navigation"

type SidebarContextType = {
  isOpen: boolean
  toggle: () => void
  isMobile: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
}

// Ensure the sidebar provider is properly configured for mobile and desktop
export function SidebarProvider({ children }: SidebarProviderProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isOpen, setIsOpen] = useState(true)
  const router = useRouter()

  // Set initial state based on device and saved preferences
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false)
    } else {
      // Try to restore from localStorage for desktop
      const savedState = localStorage.getItem("sidebar-state")
      if (savedState !== null) {
        setIsOpen(savedState === "open")
      } else {
        setIsOpen(true) // Default to open on desktop
      }
    }
  }, [isMobile])

  // Improved toggle function that works for both mobile and desktop
  const toggle = () => {
    setIsOpen((prev) => {
      const newState = !prev
      // Only save state to localStorage on desktop
      if (!isMobile) {
        localStorage.setItem("sidebar-state", newState ? "open" : "closed")
      }
      return newState
    })
  }

  // Prevent scrolling on navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Disable automatic scrolling in Next.js
      if (window.history.scrollRestoration) {
        window.history.scrollRestoration = "manual"
      }

      // Restore scroll position after navigation
      const handleRouteChangeComplete = () => {
        const savedPosition = sessionStorage.getItem("scrollPosition")
        if (savedPosition) {
          window.scrollTo(0, Number.parseInt(savedPosition, 10))
        }
      }

      // Listen for route change completion
      document.addEventListener("routeChangeComplete", handleRouteChangeComplete)

      return () => {
        document.removeEventListener("routeChangeComplete", handleRouteChangeComplete)
      }
    }
  }, [])

  return <SidebarContext.Provider value={{ isOpen, toggle, isMobile }}>{children}</SidebarContext.Provider>
}

