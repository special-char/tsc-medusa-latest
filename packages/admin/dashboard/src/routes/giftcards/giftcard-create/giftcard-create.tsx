import { Heading, Text, toast, Toaster } from "@medusajs/ui"
import { RouteFocusModal } from "../../../components/modals"
import { FormProvider, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useStore } from "../../../hooks/api"
import { useMemo } from "react"
import DynamicForm from "../../../components/custom/components/form/DynamicForm"
import { sdk } from "../../../lib/client"

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
      required: true,
      message: "Select Sales Channel",
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

type FormValues = {
  denominations: Array<{ amount: number }>
  description: string
  thumbnail: Record<string, any>
  title: string
  sales_channel: string
}

export const GiftCardCreate = () => {
  const navigate = useNavigate()
  const { store } = useStore()

  const defaultCurrency = store?.supported_currencies.find((c) => c.is_default)

  const defaultValues: any | undefined = useMemo(() => {
    if (!store) {
      return undefined
    }
    return {
      title: "",
      description: "",
      thumbnail: null,
      denominations: [
        { amount: null, currency: defaultCurrency?.currency_code },
      ],
    }
  }, [store])

  const form = useForm({
    defaultValues,
  })

  const onSubmit = async (data: FormValues) => {
    let thumbnailUrl: string | null = null
    if (data.thumbnail) {
      try {
        const uploadedFiles = await sdk.admin.upload.create({
          files: [data.thumbnail.file],
        })
        thumbnailUrl = uploadedFiles.files[0].url
      } catch (error) {
        toast.error("Failed to upload thumbnail")
        return
      }
    }

    const variants = data.denominations.map(
      (denomination: any, index: number) => ({
        title: (index + 1).toString(),
        prices: [
          {
            amount: denomination.amount / 100,
            currency_code: denomination.currency,
          },
        ],
        options: {
          Denominations: (denomination.amount / 100).toString(),
        },
        allow_backorder: true,
        manage_inventory: false,
      })
    )

    const options = [
      {
        title: "Denominations",
        values: data.denominations.map((denomination: { amount: number }) =>
          (denomination.amount / 100).toString()
        ),
      },
    ]

    const payload = {
      title: data.title,
      is_giftcard: true,
      description: data.description,
      options,
      variants,
      sales_channels: [{ id: data.sales_channel }],
    }
    try {
      await sdk.admin.product.create({
        ...payload,
        thumbnail: thumbnailUrl || undefined,
        status: "published",
      })
      navigate("/gift-cards")
      navigate(0)
      toast.success("Success", {
        description: "Gift card added successfully",
        duration: 5000,
      })
    } catch (error) {
      console.error("Error creating gift card:", error)
      toast.error("Error", {
        description: `${error}`,
        duration: 5000,
      })
    }
  }
  return (
    <RouteFocusModal>
      <Toaster />
      <RouteFocusModal.Title asChild>
        <span className="sr-only">test</span>
      </RouteFocusModal.Title>
      <RouteFocusModal.Description asChild>
        <span className="sr-only">test</span>
      </RouteFocusModal.Description>
      <RouteFocusModal.Header />
      <RouteFocusModal.Body className="flex items-center justify-center overflow-y-scroll pt-8 ">
        <div className="flex w-full max-w-lg flex-col gap-y-8 my-4">
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
            />
          </FormProvider>
        </div>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
