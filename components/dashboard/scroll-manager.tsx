"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function ScrollManager() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // This component will handle scroll restoration for all routes
  useEffect(() => {
    // Function to restore scroll position
    const restoreScrollPosition = () => {
      const savedPosition = sessionStorage.getItem("scrollPosition")
      if (savedPosition) {
        // Use requestAnimationFrame for smoother restoration
        requestAnimationFrame(() => {
          window.scrollTo(0, Number.parseInt(savedPosition, 10))

          // Add a backup in case the first attempt fails
          requestAnimationFrame(() => {
            window.scrollTo(0, Number.parseInt(savedPosition, 10))
          })
        })
      }
    }

    // Restore scroll position when the component mounts
    restoreScrollPosition()

    // Also restore after a short delay to handle any late-loading content
    const timer = setTimeout(restoreScrollPosition, 100)

    return () => {
      clearTimeout(timer)
      // Save the current scroll position when unmounting
      sessionStorage.setItem("scrollPosition", window.scrollY.toString())
    }
  }, [pathname, searchParams])

  return null
}

