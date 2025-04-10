"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadLogo } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Upload, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LogoUploaderProps {
  currentLogo?: string
}

export function LogoUploader({ currentLogo }: LogoUploaderProps) {
  const [logo, setLogo] = useState<string | null>(currentLogo || "/images/acumant-logo.png")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset error state
    setError(null)

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, SVG, etc.).")
      return
    }

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB.")
      return
    }

    setIsUploading(true)
    try {
      // In a real app, this would upload to a storage service
      // For now, we'll create a local URL
      const logoUrl = await uploadLogo(file)
      setLogo(logoUrl)
      toast({
        title: "Logo uploaded",
        description: "Your logo has been uploaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload the logo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveLogo = () => {
    // In a real app, this would delete from storage
    setLogo(null)
    toast({
      title: "Logo removed",
      description: "Your logo has been removed.",
    })
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center space-x-4">
        <div className="border rounded-md p-3 w-32 h-20 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          {logo ? (
            <div className="relative w-full h-full">
              <Image src={logo || "/placeholder.svg"} alt="Company logo" fill className="object-contain" />
            </div>
          ) : (
            <div className="text-muted-foreground text-xs text-center">No logo</div>
          )}
        </div>
        <div className="flex-1">
          <Input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="logo-upload" />
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => document.getElementById("logo-upload")?.click()}
                disabled={isUploading}
                className="w-full md:w-auto"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Logo"}
              </Button>

              {logo && (
                <Button
                  variant="outline"
                  onClick={handleRemoveLogo}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload your organization's logo to customize the platform appearance. Recommended size: 200x50px. Max
              size: 2MB.
            </p>
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mt-2">
        <p>Your logo will appear in the sidebar and other branded areas of the platform.</p>
      </div>
    </div>
  )
}

