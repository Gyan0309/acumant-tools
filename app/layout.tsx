import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Footer } from "@/components/ui/footer";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Acumant Tools",
  description: "Enterprise tools platform",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
    // Prevent scrolling on navigation
    (function() {
      if (typeof window !== 'undefined') {
        // Disable automatic scrolling
        if (history.scrollRestoration) {
          history.scrollRestoration = 'manual';
        }
        
        // Store scroll position before navigation
        let lastScrollPosition = 0;
        
        function saveScrollPosition() {
          lastScrollPosition = window.scrollY;
          sessionStorage.setItem('scrollPosition', lastScrollPosition.toString());
        }
        
        // Save position before navigation
        window.addEventListener('beforeunload', saveScrollPosition);
        
        // Save position when clicking links
        document.addEventListener('click', function(e) {
          if (e.target && (e.target.tagName === 'A' || e.target.closest('a'))) {
            saveScrollPosition();
          }
        }, true);
      }
    })();
  `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <div className="flex flex-1 relative">
              <Sidebar />
              <div className="flex-1 flex flex-col">{children}</div>
            </div>
            <Footer />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}

import "./globals.css";
