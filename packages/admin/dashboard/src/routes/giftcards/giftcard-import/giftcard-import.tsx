import { Button, Heading, Text, toast } from "@medusajs/ui"
import { RouteDrawer, useRouteModal } from "../../../components/modals"
import { useTranslation } from "react-i18next"
import { useMemo, useState } from "react"
import { UploadImport } from "./components/upload-import"
import { Trash } from "@medusajs/icons"
import { FilePreview } from "../../../components/common/file-preview"
import { getProductImportCsvTemplate } from "./helpers/import-template"
import { useStore } from "../../../hooks/api"

type ProductImportItem = {
  email: string
  firstname: string
  lastname: string
  phone: string
  product_handle: string
  quantity: number
  title: string
  unit_price: number
  [key: string]: any
}

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
  const { store } = useStore()
  const { handleSuccess } = useRouteModal()

  const supportedCurrencies = store?.supported_currencies?.reduce(
    (acc: string[], item) => {
      if (item?.is_default) {
        acc.push(item.currency_code)
      }
      return acc
    },
    [] as string[]
  )

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

    const requiredFields = [
      "product_handle",
      "title",
      "unit_price",
      "quantity",
      "email",
    ]
    const result: ProductImportItem[] = []

    lines.slice(1).forEach((line, rowIndex) => {
      if (line && line.split(",").some((value) => value.trim() !== "")) {
        const values = line.split(",")
        const record = headers.reduce((acc, header, index) => {
          acc[header] = values[index]?.trim() || ""
          return acc
        }, {} as ProductImportItem)

        const missingFields = requiredFields.filter((field) => !record[field])
        if (missingFields.length > 0) {
          throw new Error(
            `Row ${rowIndex + 2}: Missing fields: ${missingFields.join(", ")}`
          )
        } else {
          result.push(record)
        }
      }
    })

    return result
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

      const convertedJson = csvToJson(fileContent)

      const transformedItems = convertedJson?.map((item) => ({
        product_handle: item?.product_handle,
        title: item?.title,
        quantity: item?.quantity,
        unit_price: item?.unit_price,
        is_giftcard: true,
        metadata: {
          firstname: item?.firstname,
          lastname: item?.lastname,
          email: item?.email,
          phone: item?.phone,
        },
      }))

      const payload = {
        items: transformedItems,
        additionalData: {
          currency_code: supportedCurrencies?.[0],
          sales_channel_id: store?.default_sales_channel_id,
          region_id: store?.default_region_id,
        },
      }
      const res = await fetch(`${__BACKEND_URL__}/admin/bulk-order`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      console.log({ res })
      handleSuccess()
    } catch (error) {
      console.error("Error processing file:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to process the uploaded file"
      )
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
