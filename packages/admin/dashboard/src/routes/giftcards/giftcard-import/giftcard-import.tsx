import { Button, Checkbox, Heading, Label, Text, toast } from "@medusajs/ui"
import { RouteDrawer, useRouteModal } from "../../../components/modals"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { UploadImport } from "./components/upload-import"
import { Trash } from "@medusajs/icons"
import { FilePreview } from "../../../components/common/file-preview"
import { useMe, useOrders, useStore } from "../../../hooks/api"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../../lib/client"
import { DEFAULT_FIELDS } from "../../orders/order-list/const"
import { AdminUser } from "@medusajs/types"

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
  const { user } = useMe()
  const [file, setFile] = useState<File>()
  const { store } = useStore()
  const { handleSuccess } = useRouteModal()
  const navigate = useNavigate()
  const { refetch } = useOrders({
    fields: DEFAULT_FIELDS,
  })
  const [sendCorporateEmail, setSendCorporateEmail] = useState(false)

  const supportedCurrencies = store?.supported_currencies?.reduce(
    (acc: string[], item) => {
      if (item?.is_default) {
        acc.push(item.currency_code)
      }
      return acc
    },
    [] as string[]
  )

  const handleUploaded = async (file: File) => {
    setFile(file)
  }

  const handleConfirm = async () => {
    try {
      if (!file) {
        toast.error("No file uploaded")
        return
      }

      if (file.type !== "text/csv") {
        toast.error("Please upload a valid CSV file")
        return
      }

      const formData = {
        files: file,
        currency_code: supportedCurrencies?.[0] || "",
        sales_channel_id: store?.default_sales_channel_id || "",
        region_id: store?.default_region_id || "",
        user: user as unknown as AdminUser,
        sendCorporateEmail,
      }
      const res = await sdk.admin.bulkorder.upload(formData)
      handleSuccess()
      navigate(0)
    } catch (error) {
      console.error("Error processing file:", error)
      handleSuccess()
      toast.error(
        "Failed to process the uploaded file check notification for more update"
      )
      navigate(0)
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

        <Heading className="mt-6" level="h2">
          {t("giftCards.import.template.title")}
        </Heading>
        <Text size="small" className="text-ui-fg-subtle">
          {t("giftCards.import.template.description")}
        </Text>
        <div className="mt-4">
          <FilePreview
            filename={"bulkbuy-import-template.csv"}
            url={"../../../assets/csv/bulk-buy-import-template.csv"}
          />
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <Checkbox
            onCheckedChange={(checked) =>
              setSendCorporateEmail(checked as boolean)
            }
            checked={sendCorporateEmail}
            name="corporate-email"
            id="corporate-email"
          />
          <Label htmlFor="corporate-email">
            Send to Corporate Email:-{" "}
            <span className="text-blue-500 underline">{user?.email}</span>
          </Label>
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
