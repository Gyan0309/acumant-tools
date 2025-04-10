// This component is no longer needed as we're using the standard Menu icon
// We'll keep the file but make it export the Menu icon for compatibility
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarToggleIconProps {
  className?: string
}

export function SidebarToggleIcon({ className }: SidebarToggleIconProps) {
  return <Menu className={cn("h-4 w-4", className)} />
}

