"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createOrganization, updateOrganization } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { LogoUploader } from "@/components/admin/logo-uploader"

interface OrganizationFormProps {
  children: React.ReactNode
  organization?: {
    id: string
    name: string
    subscription: string
    status: string
    logo?: string | null
  }
}

export function OrganizationForm({ children, organization }: OrganizationFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: organization?.name || "",
    subscription: organization?.subscription || "standard",
    status: organization?.status || "active",
    logo: organization?.logo || null,
  })
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string }) => {
    const { name, value } = "target" in e ? e.target : e
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (organization) {
        await updateOrganization(organization.id, formData)
        toast({
          title: "Organization updated",
          description: "The organization has been updated successfully.",
        })
      } else {
        await createOrganization(formData)
        toast({
          title: "Organization created",
          description: "The organization has been created successfully.",
        })
      }
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{organization ? "Edit Organization" : "Add Organization"}</DialogTitle>
            <DialogDescription>
              {organization ? "Update organization details and subscription." : "Create a new customer organization."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Organization Logo</Label>
              <LogoUploader currentLogo={organization?.logo || null} />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subscription" className="text-right">
                Subscription
              </Label>
              <Select
                value={formData.subscription}
                onValueChange={(value) => handleChange({ name: "subscription", value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleChange({ name: "status", value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? organization
                  ? "Updating..."
                  : "Creating..."
                : organization
                  ? "Update Organization"
                  : "Create Organization"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

