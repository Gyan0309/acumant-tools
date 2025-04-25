"use client";

import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  MessageSquare,
  Database,
  Search,
  Settings,
  Users,
  Package,
  Building,
  Menu,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  CreditCard,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAllTools, isSuperAdmin, isAdmin } from "@/lib/data";
import { useSidebar } from "./sidebar-provider";
import { useSession } from "next-auth/react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tools, setTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, toggle, isMobile } = useSidebar();
  const { data: session, status } = useSession();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        if (status === "loading") return;
        const userData = session?.user;
        if (!isMounted || !userData) return;
        setUser(userData);

        const userTools = await getAllTools();
        if (!isMounted) return;
        setTools(userTools);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [session, status]);

  // Skip rendering sidebar on login page
  if (pathname === "/login") {
    return null;
  }

  const toolIcons: Record<string, React.ReactNode> = {
    chat: <MessageSquare className="h-[18px] w-[18px]" />,
    "data-formulator": <Database className="h-[18px] w-[18px]" />,
    "deep-research": <Search className="h-[18px] w-[18px]" />,
  };

  const userIsSuperAdmin = user ? isSuperAdmin(user) : false;
  const userIsAdmin = user ? isAdmin(user) : false;

  if (isLoading) {
    return (
      <div
        className={cn(
          "w-[240px] border-r animate-pulse bg-muted",
          !isOpen && "w-[60px]"
        )}
      />
    );
  }

  // Mobile toggle button when sidebar is closed
  if (isMobile && !isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 rounded-full shadow-md bg-white dark:bg-gray-800 border border-brand-teal/20"
        onClick={toggle}
      >
        <Menu className="h-4 w-4" />
      </Button>
    );
  }

  const sidebarItemClass = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
      active
        ? "bg-primary/10 text-primary font-medium"
        : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
      !isOpen && "justify-center px-0"
    );

  const sidebarIconClass = (active: boolean) =>
    cn(
      "h-[18px] w-[18px] flex-shrink-0",
      active ? "text-primary" : "text-muted-foreground"
    );

  // Custom navigation handler to prevent scrolling
  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    // Only navigate if we're going to a different page
    if (pathname !== href) {
      // Save current scroll position
      if (typeof sessionStorage !== "undefined") {
        const currentPosition = window.scrollY;
        sessionStorage.setItem("scrollPosition", currentPosition.toString());

        // Use router.push with scroll=false option for all pages
        router.push(href, { scroll: false });

        // For problematic pages, add an additional scroll restoration
        if (
          href.includes("/tools/chat") ||
          href.includes("/tools/deep-research") ||
          href.includes("/tools/data-formulator")
        ) {
          // Use a sequence of timers to ensure scroll is maintained
          setTimeout(() => {
            window.scrollTo(0, currentPosition);

            // Add a backup timer
            setTimeout(() => {
              window.scrollTo(0, currentPosition);
            }, 50);
          }, 0);
        }
      }
    }
  };

  return (
    <div
      className={cn(
        "border-r bg-background flex flex-col h-screen transition-all duration-300 relative sticky top-0",
        isOpen ? "w-[220px]" : "w-[56px]",
        isMobile && !isOpen && "hidden",
        isMobile && isOpen && "fixed inset-y-0 left-0 z-50 shadow-xl",
        className
      )}
    >
      {/* Logo section */}
      <div className="px-2 py-2 flex items-center justify-between bg-gradient-to-r from-brand-teal/10 to-brand-blue/10 dark:from-brand-teal/20 dark:to-brand-blue/20">
        <a
          href="/dashboard"
          className="flex items-center justify-center"
          onClick={(e) => handleNavigation(e, "/dashboard")}
        >
          {isOpen ? (
            <div className="h-8 flex items-center">
              <Image
                src="/images/acumant-logo.png"
                alt="Acumant Logo"
                width={120}
                height={32}
                className="dark:brightness-150"
              />
            </div>
          ) : (
            <div className="h-8 w-8 flex items-center justify-center">
              <Image
                src="/images/acumant-icon.png"
                alt="Acumant"
                width={24}
                height={24}
                className="dark:brightness-150"
              />
            </div>
          )}
        </a>
      </div>

      {/* Toggle button - positioned at the right edge of sidebar */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggle}
        className={cn(
          "absolute -right-3 top-3 h-6 w-6 rounded-full bg-white dark:bg-gray-800 border border-brand-teal/20 shadow-sm z-10",
          "flex items-center justify-center p-0"
        )}
      >
        {isOpen ? (
          <ChevronLeft className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </Button>

      <ScrollArea className="flex-1 py-1">
        <nav className="space-y-1 px-2">
          <div>
            {isOpen && (
              <div className="px-2 mb-1">
                <p className="text-[11px] font-medium text-muted-foreground">
                  DASHBOARD
                </p>
              </div>
            )}
            <a
              href="/dashboard"
              className={sidebarItemClass(pathname === "/dashboard")}
              onClick={(e) => handleNavigation(e, "/dashboard")}
            >
              <BarChart3
                className={sidebarIconClass(pathname === "/dashboard")}
              />
              {isOpen && <span className="text-[13px]">Overview</span>}
            </a>
          </div>

          <div className="mt-4">
            {tools.map((tool) => (
              <a
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className={sidebarItemClass(
                  pathname.includes(`/tools/${tool.slug}`)
                )}
                onClick={(e) => handleNavigation(e, `/tools/${tool.slug}`)}
              >
                {toolIcons[tool.slug] ? (
                  React.cloneElement(
                    toolIcons[tool.slug] as React.ReactElement,
                    {
                      className: sidebarIconClass(
                        pathname.includes(`/tools/${tool.slug}`)
                      ),
                    }
                  )
                ) : (
                  <Package
                    className={sidebarIconClass(
                      pathname.includes(`/tools/${tool.slug}`)
                    )}
                  />
                )}
                {isOpen && <span className="text-[13px]">{tool.name}</span>}
              </a>
            ))}
          </div>

          {userIsAdmin && (
            <div className="mt-4">
              <a
                href="/users"
                className={sidebarItemClass(pathname === "/users")}
                onClick={(e) => handleNavigation(e, "/users")}
              >
                <Users className={sidebarIconClass(pathname === "/users")} />
                {isOpen && <span className="text-[13px]">Users</span>}
              </a>

              <a
                href="/tools-management"
                className={sidebarItemClass(pathname === "/tools-management")}
                onClick={(e) => handleNavigation(e, "/tools-management")}
              >
                <ToggleLeft
                  className={sidebarIconClass(pathname === "/tools-management")}
                />
                {isOpen && <span className="text-[13px]">Tools</span>}
              </a>

              {userIsSuperAdmin && (
                <>
                  <a
                    href="/subscription-management"
                    className={sidebarItemClass(
                      pathname === "/subscription-management"
                    )}
                    onClick={(e) =>
                      handleNavigation(e, "/subscription-management")
                    }
                  >
                    <CreditCard
                      className={sidebarIconClass(
                        pathname === "/subscription-management"
                      )}
                    />
                    {isOpen && (
                      <span className="text-[13px]">Subscriptions</span>
                    )}
                  </a>

                  <a
                    href="/organizations"
                    className={sidebarItemClass(pathname === "/organizations")}
                    onClick={(e) => handleNavigation(e, "/organizations")}
                  >
                    <Building
                      className={sidebarIconClass(
                        pathname === "/organizations"
                      )}
                    />
                    {isOpen && (
                      <span className="text-[13px]">Organizations</span>
                    )}
                  </a>
                </>
              )}

              <a
                href="/settings"
                className={sidebarItemClass(pathname === "/settings")}
                onClick={(e) => handleNavigation(e, "/settings")}
              >
                <Settings
                  className={sidebarIconClass(pathname === "/settings")}
                />
                {isOpen && <span className="text-[13px]">Settings</span>}
              </a>
            </div>
          )}
        </nav>
      </ScrollArea>
    </div>
  );
}
