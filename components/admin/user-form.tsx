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
import { createUser, updateUser } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { isSuperAdmin } from "@/lib/data"
import { Loader2 } from "lucide-react"

interface UserFormProps {
  children: React.ReactNode
  user?: {
    id: string
    name: string
    email: string
    role: string
    status: string
    organizationId: string
  }
  currentUser: {
    id: string
    role: string
    organizationId: string
  }
}

export function UserForm({ children, user, currentUser }: UserFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "user",
    status: user?.status || "active",
    organizationId: user?.organizationId || currentUser.organizationId,
    password: "",
  })
  const { toast } = useToast()
  const userIsSuperAdmin = isSuperAdmin(currentUser)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string }) => {
    const { name, value } = "target" in e ? e.target : e
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (user) {
        await updateUser(user.id, formData)
        toast({
          title: "User updated",
          description: "The user has been updated successfully.",
        })
      } else {
        await createUser(formData)
        toast({
          title: "User created",
          description: "The user has been created successfully.",
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
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden animate-fade-in">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl">{user ? "Edit User" : "Add User"}</DialogTitle>
            <DialogDescription>
              {user ? "Update user details and permissions." : "Create a new user account."}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 border-y space-y-5">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-sm font-medium">
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
              <Label htmlFor="email" className="text-right text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            {!user && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="col-span-3"
                  required={!user}
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right text-sm font-medium">
                Role
              </Label>
              <Select value={formData.role} onValueChange={(value) => handleChange({ name: "role", value })}>
                <SelectTrigger id="role" className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right text-sm font-medium">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleChange({ name: "status", value })}>
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="px-6 py-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? (user ? "Updating..." : "Creating...") : user ? "Update User" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

