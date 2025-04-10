import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserForm } from "@/components/admin/user-form"
import { getUsers, getCurrentUser, isAdmin, isSuperAdmin, getOrganizationUsers } from "@/lib/data"
import { Plus, Search, Filter } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { redirect } from "next/navigation"

export default async function UsersPage() {
  const user = await getCurrentUser()

  if (!user || !isAdmin(user)) {
    redirect("/")
  }

  // Super admins can see all users, regular admins can only see users in their organization
  const users = isSuperAdmin(user) ? await getUsers() : await getOrganizationUsers(user.organizationId)

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />

      <main className="flex-1 container py-10 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1.5">Manage users and permissions</p>
          </div>
          <UserForm currentUser={user}>
            <Button className="gap-2 h-10 px-4 shadow-sm">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </UserForm>
        </div>

        <Card className="card-hover shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
            <div className="flex items-center gap-3 mt-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-9" />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-medium">Name</TableHead>
                    <TableHead className="font-medium">Email</TableHead>
                    <TableHead className="font-medium">Role</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="text-right font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">{user.role === "superAdmin" ? "Admin" : user.role}</TableCell>
                      <TableCell>
                        <div
                          className={
                            user.status === "active" ? "status-badge status-active" : "status-badge status-inactive"
                          }
                        >
                          {user.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <UserForm user={user} currentUser={user}>
                          <Button variant="ghost" size="sm" className="h-8 px-3 hover:bg-primary/5 hover:text-primary">
                            Edit
                          </Button>
                        </UserForm>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

