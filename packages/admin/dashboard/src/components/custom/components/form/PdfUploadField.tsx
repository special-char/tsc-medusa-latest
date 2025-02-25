import React, { useState, useEffect, useCallback } from "react"
import { ArrowUpCircleSolid, Spinner, XMark } from "@medusajs/icons"
import { sdk } from "../../../../lib/client"
import { toast } from "@medusajs/ui"

interface PDFUploadFieldProps {
  filetypes?: string[]
  initialPreview?: string
  onRemove?: () => void
  onFileUpload?: (fileUrl: string) => void
}

const PDFUploadField: React.FC<PDFUploadFieldProps> = ({
  filetypes = ["application/pdf"],
  initialPreview = "",
  onFileUpload,
  onRemove,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreview)
  const [loading, setLoading] = useState<boolean>(false) // Loading state

  useEffect(() => {
    setPreviewUrl(initialPreview)
  }, [initialPreview])

  const uploadFile = async (file: File) => {
    setLoading(true)

    try {
      if (file) {
        const response = await sdk.admin.upload.create({ files: [file] })
        if (response?.files?.length > 0) {
          const uploadedFile = response.files[0]
          const fileUrl = uploadedFile.url
          setPreviewUrl(fileUrl) // Set preview inside component
          onFileUpload?.(fileUrl) // Notify parent component (form)
          toast("PDF uploaded successfully")
        }
      }
    } catch (error) {
      console.error("File upload error:", error)
      toast("Error uploading PDF")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]

      // Validate file type
      if (!filetypes.includes(file.type)) {
        alert("Invalid file type")
        return
      }

      uploadFile(file)
    }
  }

  const handleRemoveFile = () => {
    setPreviewUrl(null)
    onRemove?.() // Notify parent to clear state
  }
  // const handleRemoveFile = async () => {
  //     if (!uploadedFileId) {
  //       setPreviewUrl(null)
  //       onRemove?.()
  //       return
  //     }

  //     setDeleting(true) // Start delete loader

  //     try {
  //       await sdk.admin.upload.delete(uploadedFileId) // Delete file from bucket
  //       setPreviewUrl(null)
  //       setUploadedFileId(null)
  //       onRemove?.()
  //       toast("PDF deleted successfully")
  //     } catch (error) {
  //       console.error("File delete error:", error)
  //       toast("Error deleting PDF")
  //     } finally {
  //       setDeleting(false) // Stop delete loader
  //     }
  //   }

  return (
    <div className="flex flex-col">
      {previewUrl ? (
        <div className="relative w-fit">
          <iframe src={previewUrl}></iframe>
          <button
            onClick={handleRemoveFile}
            className="absolute right-0 top-0 rounded-full bg-red-500 p-2 text-white"
          >
            <XMark className="text-white" />
          </button>
        </div>
      ) : (
        <label className="bg-ui-bg-component border-ui-border-strong transition-fg hover:border-ui-border-interactive focus:border-ui-border-interactive focus:shadow-borders-focus group flex h-full w-full cursor-pointer items-center justify-center gap-y-2 rounded-lg border border-dashed p-8 outline-none focus:border-solid">
          {loading ? (
            <Spinner className="animate-spin" />
          ) : (
            <span className="flex flex-col items-center justify-center gap-2">
              <span className="text-ui-contrast-fg-primary bg-ui-button-inverted flex cursor-pointer items-center gap-2 rounded-full px-4 py-2">
                <ArrowUpCircleSolid />
                <span>Upload</span>
                <input
                  type="file"
                  accept={filetypes.join(",")}
                  className="hidden"
                  onChange={handleFileChange}
                  multiple={false}
                />
              </span>
              <p className="text-center">
                Choose Pdf File to upload.
                <br />
                Pdf
              </p>
            </span>
          )}
        </label>
      )}
    </div>
  )
}

export default PDFUploadField
