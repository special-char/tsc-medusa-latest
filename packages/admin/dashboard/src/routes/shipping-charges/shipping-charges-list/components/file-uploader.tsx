import { ArrowUpTray } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import { ChangeEvent, useRef, useImperativeHandle, forwardRef } from "react"

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  isProcessing: boolean
}

export interface FileUploaderRef {
  clearInput: () => void
}

export const FileUploader = forwardRef<FileUploaderRef, FileUploaderProps>(({
  onFileSelect,
  selectedFile,
  isProcessing,
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    clearInput: () => {
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }))

  const handleOpenFileSelector = () => {
    inputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type === "text/csv" || file.name.endsWith('.csv')) {
        onFileSelect(file)
      }
    }
  }

  return (
    <div className="px-6 py-4">
      <div className="mb-4">
        <Text size="large" weight="plus" className="mb-2">
          Upload CSV File
        </Text>
        <Text size="small" className="text-ui-fg-subtle">
          Upload a CSV file containing shipping charge data. Supports quoted fields and various CSV formats.
        </Text>
      </div>

      <button
        onClick={handleOpenFileSelector}
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors border-ui-border-base hover:border-ui-border-interactive"
        disabled={isProcessing}
      >
        <ArrowUpTray className="w-8 h-8 text-ui-fg-muted mb-2" />
        <Text size="small" className="text-ui-fg-subtle text-center">
          {selectedFile
            ? `Selected: ${selectedFile.name}`
            : "Click to browse and select a CSV file"
          }
        </Text>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}) 