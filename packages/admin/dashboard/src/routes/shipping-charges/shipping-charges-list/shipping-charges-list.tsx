'use client'
import { Container, Heading, Button, toast } from "@medusajs/ui"
import { useState, useRef } from "react"
import { FileUploader, FileUploaderRef, SampleDownloader, ShippingChargesTable, ShippingChargeData } from "./components"
import { convertCsvToJson } from "./utils/csv-parser"

export const ShippingChargesList = () => {
  const [csvData, setCsvData] = useState<ShippingChargeData[]>([])
  const [csvColumns, setCsvColumns] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const fileUploaderRef = useRef<FileUploaderRef>(null)

  const handleFileSelection = (file: File) => {
    setSelectedFile(file)
    setCsvData([])
    setCsvColumns([])
  }

  const handleSubmit = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    try {
      const text = await selectedFile.text()
      const jsonData = await convertCsvToJson<ShippingChargeData>(text)
      const columns = Object.keys(jsonData[0])
      setCsvColumns(columns)
      setCsvData(jsonData)
      toast.success(`Successfully loaded ${jsonData.length} shipping charge records`)
    } catch (error) {
      console.error("Error processing CSV:", error)
      const errorMessage = error instanceof Error ? error.message : "Error processing CSV file"
      toast.error(`CSV parsing failed: ${errorMessage}. Please check your file format.`)
    } finally {
      setIsProcessing(false)
    }
  }

  const clearData = () => {
    setCsvData([])
    setCsvColumns([])
    setSelectedFile(null)
    fileUploaderRef.current?.clearInput()
    toast.success("Shipping charges data cleared")
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Shipping Charges</Heading>
        <div className="flex items-center gap-2">
          <SampleDownloader />
          {(csvData.length > 0 || selectedFile) && (
            <Button variant="secondary" size="small" onClick={clearData}>
              Clear Data
            </Button>
          )}
        </div>
      </div>

      <FileUploader
        ref={fileUploaderRef}
        onFileSelect={handleFileSelection}
        selectedFile={selectedFile}
        isProcessing={isProcessing}
      />

      {selectedFile && csvData.length === 0 && (
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
              disabled={isProcessing}
              size="large"
            >
              {isProcessing ? "Processing..." : "Submit"}
            </Button>
          </div>
        </div>
      )}

      <ShippingChargesTable
        data={csvData}
        columns={csvColumns}
        isLoading={isProcessing}
      />
    </Container>
  )
} 
