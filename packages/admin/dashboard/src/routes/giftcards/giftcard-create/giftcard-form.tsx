import { Heading, Text, toast } from "@medusajs/ui"
import { FormProvider, useForm } from "react-hook-form"
import DynamicForm from "../../../components/custom/components/form/DynamicForm"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "../../../lib/client"
import { useRouteModal } from "../../../components/modals"
import { useCreateProduct } from "../../../hooks/api"
import { useTranslation } from "react-i18next"
import { normalizeProductFormValues } from "../../products/product-create/utils"
import { useMemo } from "react"

type Props = {
  defaultValues: any
  regions: any
}

const formSchema = {
  title: {
    label: "Name",
    fieldType: "input",
    props: {
      placeholder: "The Best Gift Card",
    },
    validation: {
      required: true,
      message: "Name is required",
    },
  },
  description: {
    label: "Description",
    fieldType: "textarea",
    props: {
      placeholder: "The best gift card of all time",
    },
    validation: {},
  },
  expiryDay: {
    label: "Expiry Days From Purchase Date",
    fieldType: "input",
    props: {
      placeholder: "Enter Days",
      defaultValue: 30,
      type: "number",
      min: 30,
      step: 1,
    },
    validation: {
      required: true,
      message: "Expiry Day is required",
    },
  },
  thumbnail: {
    label: "Thumbnail",
    fieldType: "image-upload",
    props: {
      placeholder: "1200 x 1600 (3:4) recommended, up to 10MB each",
      filetypes: ["image/gif", "image/jpeg", "image/png", "image/webp"],
      multiple: false,
    },
    validation: {},
  },
  sales_channel: {
    label: "Sales Channel",
    fieldType: "SalesChannel",
    props: {
      placeholder: "Select",
    },
    validation: {
      required: {
        value: true,
        message: "Select Sales Channel",
      },
      valueAsNumber: true,
    },
  },
  denominations: {
    fieldType: "add-denomination",
    props: {
      placeholder: "add",
      preview: false,
      multiple: true,
    },
    validation: {},
  },
}

const GiftcardForm = ({ defaultValues, regions }: Props) => {
  const form = useForm({
    defaultValues,
  })
  const { handleSuccess } = useRouteModal()
  const { mutateAsync, isPending } = useCreateProduct()
  const { t } = useTranslation()

  const regionsCurrencyMap = useMemo(() => {
    if (!regions?.length) {
      return {}
    }

    return regions.reduce(
      (acc, reg) => {
        acc[reg.id] = reg.currency_code
        return acc
      },
      {} as Record<string, string>
    )
  }, [regions])

  const onSubmit = form.handleSubmit(async (data) => {
    let uploadedMedia: (HttpTypes.AdminFile & { isThumbnail: boolean })[] = []
    try {
      const fileReqs = []
      fileReqs.push(
        sdk.admin.upload
          .create({ files: [data.thumbnail.file] })
          .then((r) => r.files.map((f) => ({ ...f, isThumbnail: true })))
      )

      uploadedMedia = (await Promise.all(fileReqs)).flat()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }

    const variants = data.denominations.map(
      (denomination: any, index: number) => ({
        title: (index + 1).toString(),
        prices: {
          [denomination.currency]: denomination.amount / 100,
        },
        options: {
          Denominations: `${denomination.amount / 100}`,
        },
        inventory: [],
        allow_backorder: true,
        manage_inventory: false,
        should_create: true,
      })
    )

    const options = [
      {
        title: "Denominations",
        values: data.denominations.map(
          (denomination: { amount: number }) => `${denomination.amount / 100}`
        ),
      },
    ]

    const payload = {
      title: data.title,
      is_giftcard: true,
      description: data.description,
      options,
      variants,
      sales_channels: [
        {
          id: data.sales_channel.id,
          name: data.sales_channel.name,
        },
      ],
      discountable: false,
      categories: [],
      enable_variants: false,
      metadata: {
        expiryDay: data.expiryDay,
      },
    }

    await mutateAsync(
      normalizeProductFormValues({
        ...payload,
        media: uploadedMedia,
        status: "published",
        regionsCurrencyMap,
      }),
      {
        onSuccess: (data) => {
          toast.success(
            t("products.create.successToast", {
              title: data.product.title,
            })
          )

          handleSuccess(`../${data.product.id}`)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <div className="my-4 flex w-full max-w-lg flex-col gap-y-8">
      <div className="flex flex-col gap-y-1">
        <Heading level="h2" className="font-bold">
          Create Gift Card
        </Heading>
        <Text className="text-ui-fg-subtle">Gift Card Details</Text>
      </div>
      <FormProvider {...form}>
        <DynamicForm
          form={form as any}
          onSubmit={onSubmit as any}
          schema={formSchema as any}
          isPending={isPending}
        />
      </FormProvider>
    </div>
  )
}

export default GiftcardForm
