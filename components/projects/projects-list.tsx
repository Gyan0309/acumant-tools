"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreVertical,
  FileIcon,
  MessageSquare,
  Trash2,
  Eye,
  Loader2,
  FolderPlus,
  ArrowLeft,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import api from "@/lib/api";

interface Project {
  PartitionKey: string;
  RowKey: string;
  ProjectId: string;
  IndexId: string;
  company_id: string;
  ProjectName: string;
  CreatedOn?: string;
  Description?: string;
  DocumentSource?: string;
  FileCount?: number;
  IsActive?: boolean;
  Tags?: string;
}

// Add a helper component for empty state with suggestions
const EmptyProjectsList = ({
  onCreateProject,
}: {
  onCreateProject: () => void;
}) => (
  <div className="text-center py-12 border rounded-lg bg-muted/20">
    <div className="mx-auto w-16 h-16 rounded-full bg-brand-teal/10 flex items-center justify-center mb-4">
      <FolderPlus className="h-8 w-8 text-brand-teal" />
    </div>
    <h3 className="text-xl font-medium mb-2">No projects yet</h3>
    <p className="text-muted-foreground max-w-md mx-auto mb-6">
      Projects help you organize your documents and chat with AI about specific
      topics. Create your first project to get started.
    </p>
    <div className="space-y-4 max-w-md mx-auto">
      <h4 className="text-sm font-medium">Here are some project ideas:</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div className="border rounded-md p-3 bg-white dark:bg-gray-800">
          <span className="font-medium">Company Policies</span>
          <p className="text-xs text-muted-foreground">
            Upload HR, IT, and other company policies
          </p>
        </div>
        <div className="border rounded-md p-3 bg-white dark:bg-gray-800">
          <span className="font-medium">Product Documentation</span>
          <p className="text-xs text-muted-foreground">
            Technical specs and user guides
          </p>
        </div>
        <div className="border rounded-md p-3 bg-white dark:bg-gray-800">
          <span className="font-medium">Research Papers</span>
          <p className="text-xs text-muted-foreground">
            Academic and industry research
          </p>
        </div>
        <div className="border rounded-md p-3 bg-white dark:bg-gray-800">
          <span className="font-medium">Training Materials</span>
          <p className="text-xs text-muted-foreground">
            Onboarding and learning resources
          </p>
        </div>
      </div>
    </div>
    <Button
      onClick={onCreateProject}
      className="mt-6 bg-gradient-to-r from-brand-teal to-brand-blue text-white hover:opacity-90 transition-opacity"
    >
      <Plus className="mr-2 h-4 w-4" />
      Create Your First Project
    </Button>
  </div>
);

export function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const fetchProjects = async () => {
    try {
      const company_id = "Acumant";
      const response = await api.get(`/codecraft/get-projects-by-company_id`, {
        params: { company_id: company_id },
      });
  
      // console.log("Projects fetched:", response.data.results);
      setProjects(response.data.results);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);
  
  

  const handleCreateProject = () => {
    router.push("/tools/chat/projects/create");
  };

  const handleViewProject = (projectId: string) => {
    router.push(`/tools/chat/projects/${projectId}`);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const company_id = "Acumant";
      const [projectName, projectId] = projectToDelete.split(":::");
      const encodedProjectName = encodeURIComponent(projectName);
      await api.delete(`/codecraft/company_id/${company_id}/delete-project/${encodedProjectName}/${projectId}`)

      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully",
      });

      await fetchProjects();

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProjectToDelete(null);
    }
  };

  const handleChatWithProject = (projectId: string) => {
    router.push(`/tools/chat?project=${projectId}`);
  };

  const handleBack = () => {
    router.push("/tools/chat");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-brand-blue">
              Projects List
            </h1>
            <p className="text-muted-foreground mt-2">
              Here is a list of projects that you have created.
            </p>
          </div>
        </div>
        <Button
          onClick={handleCreateProject}
          className="bg-gradient-to-r from-brand-teal to-brand-blue text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyProjectsList onCreateProject={handleCreateProject} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.ProjectId}
              className="overflow-hidden border hover:shadow-md transition-shadow"
            >
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2
                      className="text-xl font-semibold cursor-pointer hover:text-brand-teal transition-colors"
                      onClick={() => handleViewProject(project.ProjectId)}
                    >
                      {project.ProjectName}
                    </h2>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 focus:ring-0 hover:bg-brand-teal/10 hover:text-brand-teal"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem
                          onClick={() => handleViewProject(project.ProjectId)}
                          className="cursor-pointer hover:bg-gradient-to-r hover:from-brand-teal/10 hover:to-brand-blue/10 hover:text-brand-teal focus:bg-brand-teal/10 focus:text-brand-teal"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setProjectToDelete(`${project.ProjectName}:::${project.ProjectId}`)}
                          className="cursor-pointer hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {project.Description}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileIcon className="mr-1 h-4 w-4" />
                      {project.FileCount} Files
                    </div>
                  </div>
                </div>
                <div className="border-t p-4 bg-muted/30">
                  <Button
                    variant="outline"
                    className="w-full hover:bg-gradient-to-r hover:from-brand-teal/10 hover:to-brand-blue/10 hover:text-brand-teal transition-colors"
                    onClick={() => handleChatWithProject(project.ProjectId)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat with Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
