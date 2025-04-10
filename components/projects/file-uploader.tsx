"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Check } from "lucide-react";
import type { UploadedFile } from "./project-form";

interface FileUploaderProps {
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
}

export function FileUploader({
  onFilesChange,
  maxFiles = 10,
}: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;
      if (!fileList) return;

      const newFiles: UploadedFile[] = [];
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];

      // Check if adding these files would exceed the limit
      if (uploadedFiles.length + fileList.length > maxFiles) {
        toast({
          title: "Too many files",
          description: `You can upload a maximum of ${maxFiles} files`,
          variant: "destructive",
        });
        return;
      }

      Array.from(fileList).forEach((file) => {
        if (!allowedTypes.includes(file.type)) {
          toast({
            title: "Unsupported file type",
            description: `${file.name} is not a supported file type`,
            variant: "destructive",
          });
          return;
        }

        newFiles.push({
          file,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      });

      if (newFiles.length > 0) {
        const updatedFiles = [...uploadedFiles, ...newFiles];
        setUploadedFiles(updatedFiles);
        onFilesChange(updatedFiles);
      }

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [uploadedFiles, maxFiles, onFilesChange, toast]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      if (!droppedFiles.length) return;

      const newFiles: UploadedFile[] = [];
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];

      // Check if adding these files would exceed the limit
      if (uploadedFiles.length + droppedFiles.length > maxFiles) {
        toast({
          title: "Too many files",
          description: `You can upload a maximum of ${maxFiles} files`,
          variant: "destructive",
        });
        return;
      }

      Array.from(droppedFiles).forEach((file) => {
        if (!allowedTypes.includes(file.type)) {
          toast({
            title: "Unsupported file type",
            description: `${file.name} is not a supported file type`,
            variant: "destructive",
          });
          return;
        }

        newFiles.push({
          file,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      });

      if (newFiles.length > 0) {
        const updatedFiles = [...uploadedFiles, ...newFiles];
        setUploadedFiles(updatedFiles);
        onFilesChange(updatedFiles);
      }
    },
    [uploadedFiles, maxFiles, onFilesChange, toast]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const updatedFiles = [...uploadedFiles];
      updatedFiles.splice(index, 1);
      setUploadedFiles(updatedFiles);
      onFilesChange(updatedFiles);
    },
    [uploadedFiles, onFilesChange]
  );

  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging
            ? "border-brand-teal bg-brand-teal/5"
            : "border-gray-300 dark:border-gray-600"
        } transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 rounded-full bg-muted">
            <Upload className="h-6 w-6 text-brand-teal" />
          </div>
          <h3 className="text-lg font-medium">Upload or drag and drop files</h3>
          <p className="text-sm text-muted-foreground">
            .pdf, .doc, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx files are
            supported (max {maxFiles} files, 10MB each)
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.ppt,.pptx"
          />
          <Button
            onClick={handleButtonClick}
            variant="outline"
            className="mt-2 hover:bg-gradient-to-r hover:from-brand-teal/10 hover:to-brand-blue/10 hover:text-brand-teal transition-colors"
          >
            Choose Files
          </Button>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-md border"
              >
                <div className="flex items-center space-x-2 truncate">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
