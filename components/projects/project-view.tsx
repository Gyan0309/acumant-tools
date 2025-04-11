"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploader } from "@/components/projects/file-uploader";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileIcon, Trash2, Download, Loader2 } from "lucide-react";
import type { UploadedFile } from "./project-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface ProjectViewProps {
  projectId: string;
}

interface ProjectFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: Date;
}

interface ProjectDetails {
  id: string;
  name: string;
  description: string;
  documentSource: string;
  files: ProjectFile[];
  createdAt: Date;
}

export function ProjectView({ projectId }: ProjectViewProps) {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const company_id = "Acumant";
        const response = await api.get(
          `/codecraft/company_id/${company_id}/projects/${projectId}/files`
        );

        const data = response.data;
        console.log(data)

        const flattenedFiles = (data.files || []).map((file: any) => ({
          id: file.DocumentId,
          name: file.name,
          size: String(file.size), 
          uploadedAt: new Date(file.CreatedOn),
        }));
    
        const formattedProject: ProjectDetails = {
          id: data.ProjectId,
          name: data.ProjectName,
          description: data.Description,
          documentSource: data.DocumentSource,
          createdAt: new Date(flattenedFiles?.[0]?.uploadedAt || new Date()),
          files: flattenedFiles,
        };
    
        setProject(formattedProject);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to load project details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId, toast]);

  const handleFilesChange = async (files: UploadedFile[]) => {
    if (!files.length) return;

    setIsUploading(true);

    try {
      // In a real app, this would be an API call to upload files
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock adding the files to the project
      const newFiles: ProjectFile[] = files.map((file, index) => ({
        id: `new-${index}`,
        name: file.name,
        size: String(file.size),
        uploadedAt: new Date(),
      }));

      setProject((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          files: [...prev.files, ...newFiles],
        };
      });

      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) have been uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProject((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          files: prev.files.filter((file) => file.id !== fileToDelete),
        };
      });

      toast({
        title: "File deleted",
        description: "The file has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFileToDelete(null);
    }
  };

  const handleBack = () => {
    router.push("/tools/chat/projects");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Project not found</h2>
        <p className="text-muted-foreground mt-2">
          The project you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={handleBack} className="mt-4">
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-brand-blue">
            Project View
          </h1>
          <p className="text-muted-foreground mt-1">
            Here you can view and make changes to a project
          </p>
        </div>
      </div>

      <Card className="border shadow-md">
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Project Details</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Description:</span>
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">
                      Document Source:
                    </span>
                    {/* <p className="text-sm text-muted-foreground capitalize">
                      {project.documentSource.replace("_", " ")}
                    </p> */}
                    <p className="text-sm text-muted-foreground capitalize">
                      {project.documentSource
                        ? project.documentSource.replace("_", " ")
                        : "No source available"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Created:</span>
                    <p className="text-sm text-muted-foreground">
                      {project.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  Upload Additional Files
                </h3>
                <FileUploader onFilesChange={handleFilesChange} maxFiles={5} />
                {isUploading && (
                  <div className="flex items-center justify-center mt-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                    <span className="text-sm">Uploading files...</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Project Files</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name / ID</TableHead>
                    <TableHead className="w-[100px]">Size</TableHead>
                    <TableHead className="w-[150px]">Uploaded</TableHead>
                    <TableHead className="w-[100px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileIcon className="h-4 w-4 text-primary" />
                          <span className="truncate max-w-[300px]">
                            {file.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {file.size} 
                      </TableCell>
                      <TableCell>
                        {file.uploadedAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setFileToDelete(file.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!fileToDelete}
        onOpenChange={(open) => !open && setFileToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              file from the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFile}
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
