import {
  Button,
  Checkbox,
  Heading,
  Input,
  Label,
  Text,
  toast,
} from "@medusajs/ui"
import { RouteDrawer, useRouteModal } from "../../../components/modals"
import { useTranslation } from "react-i18next"
import { useMemo, useState } from "react"
import { UploadImport } from "./components/upload-import"
import { Trash } from "@medusajs/icons"
import { FilePreview } from "../../../components/common/file-preview"
import {
  useMe,
  useOrders,
  useSalesChannels,
  useStore,
  useVendorMe,
} from "../../../hooks/api"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../../lib/client"
import { DEFAULT_FIELDS } from "../../orders/order-list/const"
import { AdminUser } from "@medusajs/types"
import { getSalesChannelIds } from "../../../const/get-sales-channel"
import { getGiftImportCsvTemplate } from "./helpers/import-template"
import { Controller, Form, useForm } from "react-hook-form"

export const GiftCardImport = () => {
  const { t } = useTranslation()

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("giftCards.import.header")}</Heading>
        </RouteDrawer.Title>
      </RouteDrawer.Header>
      <GiftImportContent />
    </RouteDrawer>
  )
}

const GiftImportContent = () => {
  const { t } = useTranslation()
  const { user: adminUser, error: adminError } = useMe()
  const { user: vendorUser } = useVendorMe()
  const user = adminUser || vendorUser
  const [file, setFile] = useState<File>()
  const { store } = useStore()
  const { handleSuccess } = useRouteModal()
  const navigate = useNavigate()
  const { refetch } = useOrders({
    fields: DEFAULT_FIELDS,
  })
  const form = useForm({
    defaultValues: {
      corporateEmail: false,
      promotionCode: "",
    },
  })

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
  const salesChannelIds = getSalesChannelIds()
  const { sales_channels } = useSalesChannels({
    ...(salesChannelIds && salesChannelIds[0] && salesChannelIds[0].length !== 0
      ? { id: salesChannelIds[0] }
      : {}),
  })

  const handleConfirm = async () => {
    try {
      const { corporateEmail, promotionCode } = form.getValues()
      if (!file) {
        toast.error("No file uploaded")
        return
      }

      if (file.type !== "text/csv") {
        toast.error("Please upload a valid CSV file")
        return
      }
      let s =
        salesChannelIds &&
        salesChannelIds[0] &&
        salesChannelIds[0].length !== 0 &&
        sales_channels &&
        sales_channels.length > 0
          ? sales_channels[0].id || ""
          : store?.default_sales_channel_id || ""

      const formData = {
        files: file,
        currency_code: supportedCurrencies?.[0] || "",
        sales_channel_id: s,
        region_id: store?.default_region_id || "",
        user: user as unknown as AdminUser,
        sendCorporateEmail: corporateEmail,
        promotionCode,
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
  const giftImportContent = useMemo(() => {
    return getGiftImportCsvTemplate()
  }, [])

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
            url={giftImportContent}
          />
        </div>
        <Form control={form.control} className="mt-4">
          <Controller
            name="promotionCode"
            control={form?.control}
            render={({ field }) => {
              return (
                <>
                  <Label htmlFor="promotionCode">Apply Promotion Code</Label>
                  <Input
                    className="mt-2"
                    placeholder="Promotion Code"
                    {...field}
                  />
                </>
              )
            }}
          />
          <Controller
            name="corporateEmail"
            control={form?.control}
            render={({ field }) => {
              return (
                <div className="mt-4 flex items-center space-x-2">
                  <Checkbox
                    {...field}
                    onCheckedChange={field.onChange}
                    checked={field.value}
                    id="corporateEmail"
                  />
                  <Label htmlFor="corporateEmail">
                    Send to Corporate Email:-{" "}
                    <span className="text-blue-500 underline">
                      {user?.email}
                    </span>
                  </Label>
                </div>
              )
            }}
          />
        </Form>
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
