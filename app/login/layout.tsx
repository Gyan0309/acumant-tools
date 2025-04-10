import type React from "react"

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This is a dedicated layout for the login page that doesn't include the sidebar
  // We don't need to add a footer here as it's already in the RootLayout
  return <>{children}</>
}

