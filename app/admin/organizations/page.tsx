import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrganizationForm } from "@/components/admin/organization-form";
import { getOrganizations, getCurrentUser, isSuperAdmin } from "@/lib/data";
import { Plus } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default async function OrganizationsPage() {
  const user = await getCurrentUser();

  // Only super admins can access this page
  if (!user || !isSuperAdmin(user)) {
    redirect("/");
  }

  const organizations = await getOrganizations();

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />

      <main className="flex-1 container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Organization Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage customer organizations and subscriptions
            </p>
          </div>
          <OrganizationForm>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Organization
            </Button>
          </OrganizationForm>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
            <CardDescription>
              Manage customer organizations and their subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div className="h-8 w-8 relative border rounded-md bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                        {org.logo ? (
                          <Image
                            src={org.logo || "/placeholder.svg"}
                            alt={org.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No logo
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {org.name}
                      {org.id === "acumant" && (
                        <Badge variant="outline" className="ml-2">
                          Acumant
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="capitalize">
                      {org.subscription}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          org.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        }`}
                      >
                        {org.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <OrganizationForm organization={org}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </OrganizationForm>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
