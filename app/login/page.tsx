"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { login } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Database, MessageSquare, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/20 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const handleMicrosoftLogin = () => {
    signIn("azure-ad");
  };

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-[#f8f9fc] dark:bg-[#0d1117]">
      {/* Hero Section */}
      <div className="w-full md:w-3/5 flex items-center justify-center p-6 md:p-10 bg-gradient-to-b from-[#f0f4ff] to-[#f8f9fc] dark:from-[#0d1117] dark:to-[#111827] overflow-auto">
        <div className="max-w-2xl space-y-4">
          {/* Acumant Logo */}
          <div className="mb-6">
            <Image
              src="/images/acumant-logo.png"
              alt="Acumant Logo"
              width={160}
              height={45}
              className="dark:brightness-150"
            />
          </div>

          <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-teal/10 to-brand-blue/10 dark:from-brand-teal/20 dark:to-brand-blue/20 rounded-full mb-2">
            <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-brand-blue">
              Enterprise AI Platform
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1e293b] dark:text-white">
            Intelligent tools for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-brand-blue">
              modern enterprises
            </span>
          </h1>
          <p className="text-lg text-[#475569] dark:text-[#94a3b8] max-w-xl">
            Transform your workflow with AI-powered tools designed for
            productivity, insight, and innovation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
            <div className="bg-white dark:bg-[#1e293b] p-3 rounded-xl shadow-sm border border-[#e2e8f0] dark:border-[#334155]">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-brand-teal/10 dark:bg-brand-teal/20">
                  <MessageSquare className="h-5 w-5 text-brand-teal" />
                </div>
                <h3 className="font-medium">AI Chat</h3>
              </div>
              <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                Intelligent assistant for answering questions
              </p>
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-3 rounded-xl shadow-sm border border-[#e2e8f0] dark:border-[#334155]">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-brand-blue/10 dark:bg-brand-blue/20">
                  <Database className="h-5 w-5 text-brand-blue" />
                </div>
                <h3 className="font-medium">Data Formulator</h3>
              </div>
              <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                Transform and analyze data with AI
              </p>
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-3 rounded-xl shadow-sm border border-[#e2e8f0] dark:border-[#334155]">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-brand-blue/10 dark:bg-brand-blue/20">
                  <Search className="h-5 w-5 text-brand-blue" />
                </div>
                <h3 className="font-medium">Deep Research</h3>
              </div>
              <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                Conduct in-depth research on any topic
              </p>
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-3 rounded-xl shadow-sm border border-[#e2e8f0] dark:border-[#334155]">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-brand-teal/10 dark:bg-brand-teal/20">
                  <Bot className="h-5 w-5 text-brand-teal" />
                </div>
                <h3 className="font-medium">Enterprise Features</h3>
              </div>
              <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                Security and collaboration for teams
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full md:w-2/5 flex items-center justify-center p-6 bg-white dark:bg-[#111827] overflow-auto">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    variant="link"
                    className="px-0 font-normal h-auto"
                    type="button"
                  >
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-brand-teal to-brand-blue hover:from-brand-teal/90 hover:to-brand-blue/90"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Microsoft Login Button - now below the form */}
            <Button
              onClick={handleMicrosoftLogin}
              className="w-full bg-[#2F2F2F] hover:bg-[#1E1E1E] text-white flex items-center justify-center gap-2 h-10"
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 23 23"
              >
                <path fill="#f3f3f3" d="M0 0h10.931v10.931H0z" />
                <path fill="#f35325" d="M11.954 0h10.931v10.931H11.954z" />
                <path fill="#81bc06" d="M0 11.954h10.931v10.931H0z" />
                <path fill="#05a6f0" d="M11.954 11.954h10.931v10.931H11.954z" />
              </svg>
              <span>Sign in with Microsoft</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
