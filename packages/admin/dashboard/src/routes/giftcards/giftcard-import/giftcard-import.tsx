import { Button, Heading, Text, toast } from "@medusajs/ui"
import { RouteDrawer, useRouteModal } from "../../../components/modals"
import { useTranslation } from "react-i18next"
import { useMemo, useState } from "react"
import { useConfirmImportProducts, useImportProducts } from "../../../hooks/api"
import { UploadImport } from "./components/upload-import"
import { ImportSummary } from "./components/import-summary"
import { Trash } from "@medusajs/icons"
import { FilePreview } from "../../../components/common/file-preview"
import { getProductImportCsvTemplate } from "./helpers/import-template"

export const GiftCardImport = () => {
  const { t } = useTranslation()

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("giftCards.import.header")}</Heading>
        </RouteDrawer.Title>
      </RouteDrawer.Header>
      <ProductImportContent />
    </RouteDrawer>
  )
}

const ProductImportContent = () => {
  const { t } = useTranslation()
  const [file, setFile] = useState<File>()
  console.log(file?.name, "uploaded file")

  // const { mutateAsync: importProducts, isPending, data } = useImportProducts()
  // const { mutateAsync: confirm } = useConfirmImportProducts()
  // const { handleSuccess } = useRouteModal()

  const productImportTemplateContent = useMemo(() => {
    return getProductImportCsvTemplate()
  }, [])

  const handleUploaded = async (file: File) => {
    setFile(file)
  }

  const csvToJson = (csv: string): any[] => {
    const lines = csv.split("\n").map((line) => line.trim())
    const headers = lines[0]?.split(",")

    if (!headers) {
      toast.error("Invalid CSV format")
      return []
    }

    return lines.slice(1).map((line) => {
      const values = line.split(",")
      return headers.reduce(
        (acc, header, index) => {
          acc[header] = values[index] || ""
          return acc
        },
        {} as Record<string, string>
      )
    })
  }

  const handleConfirm = async () => {
    try {
      if (!file) {
        toast.error("No file uploaded")
        return
      }

      const readFile = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (event) => resolve(event.target?.result as string)
          reader.onerror = (error) => reject(error)
          reader.readAsText(file)
        })
      }

      const fileContent = await readFile(file)

      if (file.type !== "text/csv") {
        toast.error("Please upload a valid CSV file")
        return
      }

      const convertedjson = csvToJson(fileContent)
      console.log(convertedjson, "Converted JSON")

      const payload = {
        items: convertedjson,
        orderData: { currency_code: "mur" },
      }

      console.log({ payload })

      const res = await fetch(`${__BACKEND_URL__}/admin/bulk-order`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      console.log({ res })
    } catch (error) {
      console.error("Error processing file:", error)
      toast.error("Failed to process the uploaded file")
    }
  }

  const uploadedFileActions = [
    {
      actions: [
        {
          label: t("actions.delete"),
          icon: <Trash />,
          onClick: () => setFile(undefined),
        },
      ],
    },
  ]

  return (
    <>
      <RouteDrawer.Body>
        <Heading level="h2">{t("giftCards.import.upload.title")}</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          {t("giftCards.import.upload.description")}
        </Text>

        <div className="mt-4">
          {file?.name ? (
            <FilePreview
              filename={file?.name}
              // loading={isPending}
              activity={t("giftCards.import.upload.preprocessing")}
              actions={uploadedFileActions}
            />
          ) : (
            <UploadImport onUploaded={handleUploaded} />
          )}
        </div>

        {/* {data?.summary && !!filename && (
          <div className="mt-4">
            <ImportSummary summary={data?.summary} />
          </div>
        )} */}

        <Heading className="mt-6" level="h2">
          {t("giftCards.import.template.title")}
        </Heading>
        <Text size="small" className="text-ui-fg-subtle">
          {t("giftCards.import.template.description")}
        </Text>
        <div className="mt-4">
          <FilePreview
            filename={"product-import-template.csv"}
            url={productImportTemplateContent}
          />
        </div>
      </RouteDrawer.Body>
      <RouteDrawer.Footer>
        <div className="flex items-center gap-x-2">
          <RouteDrawer.Close asChild>
            <Button size="small" variant="secondary">
              {t("actions.cancel")}
            </Button>
          </RouteDrawer.Close>
          <Button onClick={handleConfirm} size="small" disabled={!file?.name}>
            {t("actions.import")}
          </Button>
        </div>
      </RouteDrawer.Footer>
    </>
  )
}
