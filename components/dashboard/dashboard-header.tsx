"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, LogOut, Settings, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  user: {
    id: string
    name: string
    email: string
    role: string
    avatar?: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    // In a real app, this would call a logout function
    router.push("/login")
  }

  const isAdmin = user?.role === "admin"
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U"

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-brand-blue">
              Acumant
            </span>
          </Link>
          <Badge variant="outline" className="ml-2 hidden md:flex">
            v1.0.0
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <Avatar className="h-9 w-9 border-2 border-brand-teal/20 hover:border-brand-teal/50 transition-colors">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-brand-teal to-brand-blue text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-[#1e293b] border border-brand-teal/10 overflow-hidden z-50">
                <div className="p-2 bg-gradient-to-r from-brand-teal/5 to-brand-blue/5">
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="py-1 border-t border-brand-teal/10">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-brand-teal/10 hover:to-brand-blue/10 cursor-pointer"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4 text-brand-teal" />
                    Profile
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-brand-teal/10 hover:to-brand-blue/10 cursor-pointer"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="mr-2 h-4 w-4 text-brand-blue" />
                      Admin Settings
                    </Link>
                  )}
                </div>

                <div className="py-1 border-t border-brand-teal/10">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false)
                      handleLogout()
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-brand-teal/10 hover:to-brand-blue/10 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

