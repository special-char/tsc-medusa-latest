import { RouteFocusModal } from "../../../components/modals"
import { useRegions } from "../../../hooks/api"
import { usePricePreferences } from "../../../hooks/api/price-preferences"
import { useSalesChannel } from "../../../hooks/api/sales-channels"
import { useStore } from "../../../hooks/api/store"
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { Button, Input, Label, Text } from "@medusajs/ui"
import { useMemo } from "react"
import RichTextInput from "./components/RichTextInput"
import { useNavigate } from "react-router-dom"

const createGiftTemplates = async (data: any) => {
  try {
    const response = await fetch(`${__BACKEND_URL__}/admin/gift-templates`, {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const res = await response.json()
    console.log({ res }, "post template")
    return res
  } catch (error) {
    console.log(error)
  }
}

export const GiftTemplateCreate = () => {
  const navigate = useNavigate()

  const {
    store,
    isPending: isStorePending,
    isError: isStoreError,
    error: storeError,
  } = useStore({
    fields: "+default_sales_channel",
  })

  const {
    sales_channel,
    isPending: isSalesChannelPending,
    isError: isSalesChannelError,
    error: salesChannelError,
  } = useSalesChannel(store?.default_sales_channel_id!, {
    enabled: !!store?.default_sales_channel_id,
  })

  const {
    regions,
    isPending: isRegionsPending,
    isError: isRegionsError,
    error: regionsError,
  } = useRegions({ limit: 9999 })

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FieldValues>({
    defaultValues: useMemo(() => {
      return {
        title: "",
        content: "",
      }
    }, []),
    mode: "onBlur",
  })

  const {
    price_preferences,
    isPending: isPricePreferencesPending,
    isError: isPricePreferencesError,
    error: pricePreferencesError,
  } = usePricePreferences({
    limit: 9999,
  })

  const ready =
    !!store &&
    !isStorePending &&
    !!regions &&
    !isRegionsPending &&
    !!sales_channel &&
    !isSalesChannelPending &&
    !!price_preferences &&
    !isPricePreferencesPending

  if (isStoreError) {
    throw storeError
  }

  if (isRegionsError) {
    throw regionsError
  }

  if (isSalesChannelError) {
    throw salesChannelError
  }

  if (isPricePreferencesError) {
    throw pricePreferencesError
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await createGiftTemplates(data)
      navigate("/gift-templates")
      navigate(0)
    } catch (error) {
      console.log("onSubmit error", error)
    }
  }

  return (
    <RouteFocusModal>
      <RouteFocusModal.Header />
      <RouteFocusModal.Body className="relative w-full py-16 px-8 overflow-y-scroll">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => {
                  return (
                    <>
                      <Label>
                        <span>Title</span>
                        <Input placeholder="Title" {...field} />
                      </Label>
                    </>
                  )
                }}
              />
              {errors.title && (
                <Text className="text-red-500">
                  {errors?.title?.message as string}
                </Text>
              )}
            </div>
            <div>
              <Controller
                name="content"
                control={control}
                rules={{
                  required: "Email Template is required",
                  pattern: {
                    value:
                      /<[^>]+>\s*[^<>\s][\s\S]*?<\/[^>]+>|<(img|iframe|video|a)\b[^>]*\/?>/,
                    message: "Invalid email Template",
                  },
                }}
                render={({ field }) => (
                  <RichTextInput
                    label={"Email Template"}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.content && (
                <Text className="text-red-500">
                  {errors.content.message as string}
                </Text>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
