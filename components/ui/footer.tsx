import type React from "react"
import { cn } from "@/lib/utils"

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "minimal"
}

export function Footer({ className, variant = "default", ...props }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        "w-full border-t bg-background/80 backdrop-blur-sm",
        variant === "default" ? "py-4" : "py-2",
        className,
      )}
      {...props}
    >
      <div className="container flex flex-col items-center justify-center gap-1 text-center">
        <p className="text-sm text-muted-foreground">&copy; {currentYear} BetaHub AI. All rights reserved.</p>
        <p className="text-xs text-muted-foreground">
          Powered by <span className="font-medium text-primary"> <a href="https://betahub.ai/">BetaHub AI</a></span> Enterprise AI Platform
        </p>
      </div>
    </footer>
  )
}

