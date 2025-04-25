"use client";

import type React from "react";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileUploader } from "@/components/projects/file-uploader";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FileIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
interface ProjectFormProps {
  onCancel?: () => void;
}

export interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
}

export function ProjectForm({ onCancel }: ProjectFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    documentSource: "file-uploader",
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  // Add helpful suggestions for document sources
  const documentSources = [
    { value: "file-uploader", label: "File Uploader" },
    { value: "web-url", label: "Web URL" },
    { value: "sharepoint", label: "SharePoint" },
    { value: "google-drive", label: "Google Drive" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProjectData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesChange = useCallback((newFiles: UploadedFile[]) => {
    setFiles(newFiles);
  }, []);

  const handleNext = () => {
    if (!projectData.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  // Ensure the form is properly submitting and navigating
  const handleSubmit = async () => {
    if (!projectData.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "Files required",
        description: "Please upload at least one file to continue",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const company_id = "Acumant";
      const formData = new FormData();
      formData.append("company_id", company_id);
      formData.append("ProjectName", projectData.name);
      formData.append("DocumentSource", projectData.documentSource);
      formData.append("Description", projectData.description);
      formData.append("Tags", "xyz");
      formData.append("IsActive", String(true));
      formData.append("CreatedBy", session?.user?.role);

      files.forEach((uploadedFile) => {
        formData.append("files", uploadedFile.file);
      });

      const response = await api.post("/codecraft/create-project", formData);

      const data = response.data;
      console.log(data);

      const train = await api.post(
        "/codecraft/pinecone/train-pinecone-from-blob-storage-for-project",
        {
          company_id: company_id,
          project_name: projectData.name,
        }
      );
      console.log(train.data);

      toast({
        title: "Project created",
        description: `Your project has been created successfully. ${data["No. of files uploaded"]} files uploaded.`,
      });

      router.push("/tools/chat/projects");
    } catch (error: any) {
      console.error("Submission Error:", error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-teal to-brand-blue">
          Create Project
        </h1>
        <p className="text-muted-foreground mt-2">
          Here you can create a new project
        </p>
      </div>

      {step === 1 ? (
        <Card className="border shadow-md">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Project Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={projectData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Project Name"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="documentSource"
                  className="text-base font-medium"
                >
                  Document Source
                </Label>
                <Select
                  value={projectData.documentSource}
                  onValueChange={(value) =>
                    handleSelectChange("documentSource", value)
                  }
                >
                  <SelectTrigger id="documentSource" className="w-full">
                    <SelectValue placeholder="Select a document source" />
                  </SelectTrigger>
                  {/* Update the SelectContent to show descriptions */}
                  <SelectContent>
                    {documentSources.map((source) => (
                      <SelectItem
                        key={source.value}
                        value={source.value}
                        className="hover:bg-gradient-to-r hover:from-brand-teal/10 hover:to-brand-blue/10 hover:text-brand-teal focus:bg-brand-teal/10 focus:text-brand-teal"
                      >
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={projectData.description}
                  onChange={handleInputChange}
                  placeholder="Enter Description"
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="hover:bg-gradient-to-r hover:from-brand-teal/10 hover:to-brand-blue/10 hover:text-brand-teal transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-brand-teal to-brand-blue text-white hover:opacity-90 transition-opacity"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border shadow-md">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">{projectData.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {projectData.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">
                    Document Source
                  </Label>
                  <p className="text-sm">
                    {
                      documentSources.find(
                        (s) => s.value === projectData.documentSource
                      )?.label
                    }
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Selected Files
                    </Label>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-md bg-muted/50 border border-border"
                        >
                          <FileIcon className="h-4 w-4 text-brand-teal" />
                          <span className="text-sm truncate flex-1">
                            {file.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-md">
            <CardContent className="pt-6">
              <FileUploader onFilesChange={handleFilesChange} />
            </CardContent>
          </Card>

          <div className="md:col-span-2 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="hover:bg-gradient-to-r hover:from-brand-teal/10 hover:to-brand-blue/10 hover:text-brand-teal transition-colors"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-brand-teal to-brand-blue text-white hover:opacity-90 transition-opacity"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Training...
                </>
              ) : (
                "Train"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
