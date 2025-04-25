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
import { Switch } from "@/components/ui/switch";
import { ToolForm } from "@/components/admin/tool-form";
import { getAllTools, isSuperAdmin } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { Plus } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { redirect } from "next/navigation";
import { OrganizationToolAccess } from "@/components/admin/organization-tool-access";

export default async function ToolsPage() {
  const user = await getCurrentUser();

  // Only super admins can access this page
  if (!user || !isSuperAdmin(user)) {
    redirect("/");
  }

  const tools = await getAllTools();

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />

      <main className="flex-1 container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Tool Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage tools and customer access
            </p>
          </div>
          <ToolForm>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tool
            </Button>
          </ToolForm>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Available Tools</CardTitle>
            <CardDescription>
              Enable or disable tools globally and manage their configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">{tool.name}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {tool.description}
                    </TableCell>
                    <TableCell>
                      <Switch checked={tool.isActive} />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <ToolForm tool={tool}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </ToolForm>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <OrganizationToolAccess />
      </main>
    </div>
  );
}
