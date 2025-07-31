'use client'
import { Container, Heading, Button, toast, usePrompt } from "@medusajs/ui"
import { useState, useRef, useCallback } from "react"
import { FileUploader, FileUploaderRef, SampleDownloader, ShippingChargesTable, ShippingChargeData } from "./components"
import { parseShippingChargesCsv } from "./utils/csv-parser"
import { useShippingCharges } from "./utils/use-shipping-charges"

export const ShippingChargesList = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileUploaderRef = useRef<FileUploaderRef>(null)
  const prompt = usePrompt()

  const {
    data,
    columns,
    isLoading,
    submitData,
    clearData,
    hasData
  } = useShippingCharges()

  const handleFileSelection = useCallback((file: File) => {
    setSelectedFile(file)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) return

    try {
      const text = await selectedFile.text()
      const jsonData = await parseShippingChargesCsv<ShippingChargeData>(text)

      await submitData(jsonData)
      setSelectedFile(null)
      fileUploaderRef.current?.clearInput()

      toast.success(`Successfully loaded ${jsonData.length} shipping charge records`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error processing CSV file"
      toast.error(`Failed to submit shipping charges: ${errorMessage}`)
    }
  }, [selectedFile, submitData])

  const handleClearData = useCallback(async () => {
    const confirmed = await prompt({
      title: "Are you sure?",
      description: "Are you sure you want to delete all shipping charges? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    })

    if (!confirmed) return

    try {
      await clearData()
      setSelectedFile(null)
      fileUploaderRef.current?.clearInput()
      toast.success("Shipping charges data cleared")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error deleting shipping charges"
      toast.error(`Failed to delete shipping charges: ${errorMessage}`)
    }
  }, [clearData, prompt])

  const showFileUploader = !hasData
  const showSubmitSection = selectedFile && !hasData
  const showClearButton = hasData || selectedFile

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Shipping Charges</Heading>
        <div className="flex items-center gap-2">
          <SampleDownloader />
          {showClearButton && (
            <Button
              variant="secondary"
              size="small"
              onClick={handleClearData}
              disabled={isLoading}
            >
              Clear Data
            </Button>
          )}
        </div>
      </div>

      {showFileUploader && (
        <FileUploader
          ref={fileUploaderRef}
          onFileSelect={handleFileSelection}
          selectedFile={selectedFile}
          isProcessing={isLoading}
        />
      )}

      {showSubmitSection && (
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ui-fg-base">
                File selected: {selectedFile.name}
              </p>
              <p className="text-xs text-ui-fg-subtle">
                Click submit to process and preview the data
              </p>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              size="large"
            >
              {isLoading ? "Processing..." : "Submit"}
            </Button>
          </div>
        </div>
      )}

      <ShippingChargesTable
        data={data}
        columns={columns}
        isLoading={isLoading}
      />
    </Container>
  )
} 
