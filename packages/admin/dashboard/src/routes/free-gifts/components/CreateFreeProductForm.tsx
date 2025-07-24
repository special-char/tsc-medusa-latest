import { Button, FocusModal, Heading, Input, Label, Text } from "@medusajs/ui"
import { Combobox } from "./Combobox"
import { AdminProductVariant } from "@medusajs/framework/types"
import { useForm, Controller } from "react-hook-form"
import { useEffect } from "react"
import { useComboboxData } from "../hooks/use-combobox-data"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/client"
import { FreeProductsDTO } from "../type"

type FormType = {
  title: string
  region_id: string
  min_price: number
  max_price: number
  variant_id: string
  product_id: string
}

export type FreeProductBodyType = {
  title: string
  product_id: string
  variant_id: string
  min_price: number
  max_price: number
  metadata?: Record<string, any>
}

const CreateFreeProductForm = ({
  onSuccess,
  onError,
  open,
  type,
  data,
  onOpenChange,
}: {
  variant?: AdminProductVariant
  productId?: string
  onSuccess?: () => void
  onError?: (error: any) => void
  open: boolean
  type?: "edit" | "create"
  data?: FreeProductsDTO
  onOpenChange: (value: boolean) => void
}) => {
  const form = useForm<FormType>({
    defaultValues: {
      title: data?.title || undefined,
      region_id: data?.region_id || undefined,
      variant_id: data?.variant_id || undefined,
      product_id: data?.product_id || undefined,
      min_price: data?.min_price || undefined,
      max_price: data?.max_price || undefined,
    },
  })

  const region = useComboboxData({
    queryKey: ["region"],
    queryFn: (params) => sdk.admin.region.list(params),
    getOptions: (data) =>
      data.regions.map((type) => ({
        label: type.name,
        value: type.id,
        currency_code: type.currency_code,
      })),
  })

  const selectedRegionId = form.watch("region_id")
  const variantList = useComboboxData({
    queryKey: ["variant", selectedRegionId],
    queryFn: (params: any) => {
      if (selectedRegionId) {
        return sdk.client.fetch<any>(
          `/admin/product-variant?region_id=${selectedRegionId}&fields=*variants.calculated_price${params.q ? `&q=${params.q}` : ""}`,
          params
        )
      }
      return Promise.resolve({ variants: [] })
    },
    getOptions: (data) => {
      return data?.variants?.map((variant: any) => {
        return {
          label: variant.title + " - " + variant.product.title,
          value: variant.id,
          product_id: variant.product_id,
          image: variant.product?.thumbnail,
          price: variant.calculated_price,
        }
      })
    },
  })

  const selectedVariantId = form.watch("variant_id")

  const queryClient = useQueryClient()

  const { mutate: createFreeProduct } = useMutation({
    mutationFn: async (formData: FreeProductBodyType) => {
      const res = await sdk.client.fetch("/admin/free-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: formData,
      })
      return res as any
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["free-products-list"] })
      onSuccess?.()
    },
    onError: (error: any) => {
      onError?.(error)
    },
  })

  const { mutate: updateFreeProduct } = useMutation({
    mutationFn: async (formData: FreeProductBodyType) => {
      if (data) {
        const res = await sdk.client.fetch(`/admin/free-product/${data.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: formData,
        })
        return res as any
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["free-products-list"] })
      onSuccess?.()
    },
    onError: (error: any) => {
      onError?.(error)
    },
  })

  useEffect(() => {
    if (!selectedVariantId) {
      form.setValue("product_id", "")
      return
    }
    const selectedVariant: any = variantList.options.find(
      (option: any) => option.value === selectedVariantId
    )
    if (selectedVariant?.product_id) {
      form.setValue("product_id", selectedVariant.product_id)
    }
  }, [selectedVariantId, variantList.options, form])

  const onSubmit = (data: FormType) => {
    console.log({ ...data })
    if (type === "create") createFreeProduct(data)
    if (type === "edit") updateFreeProduct(data)
  }

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FocusModal.Header>
            <Button
              type="submit"
              isLoading={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting}
            >
              Save
            </Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <Heading>Create Free Product</Heading>
                <Text className="text-ui-fg-subtle">
                  Fill in the details to create a free product.
                </Text>
              </div>
              {/* Title Field */}
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="title" className="text-ui-fg-subtle">
                  Title
                </Label>
                <Controller
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <Input id="title" placeholder="Title" {...field} />
                  )}
                />
                {form.formState.errors.title && (
                  <Text className="text-ui-fg-error">Title is required</Text>
                )}
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="region_id" className="text-ui-fg-subtle">
                  Select Region
                </Label>
                <Controller
                  control={form.control}
                  name="region_id"
                  rules={{ required: "Region is required" }}
                  render={({ field }) => {
                    return (
                      <Combobox
                        {...field}
                        options={region.options}
                        searchValue={region.searchValue}
                        onSearchValueChange={region.onSearchValueChange}
                        fetchNextPage={region.fetchNextPage}
                        onChange={(e) => {
                          form.setValue("variant_id", "")
                          field.onChange(e)
                        }}
                      />
                    )
                  }}
                />
                {form.formState.errors.region_id && (
                  <Text className="text-ui-fg-error">Region is required</Text>
                )}
              </div>
              {/* Variant Field */}
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="variant_id" className="text-ui-fg-subtle">
                  Select Variant
                </Label>
                <Controller
                  control={form.control}
                  name="variant_id"
                  rules={{ required: "Variant is required" }}
                  render={({ field }) => {
                    return (
                      <Combobox
                        {...field}
                        options={variantList.options}
                        searchValue={variantList.searchValue}
                        onSearchValueChange={variantList.onSearchValueChange}
                        fetchNextPage={variantList.fetchNextPage}
                        onChange={(e) => {
                          // const selectedVariant = variantList.options.find(
                          // 	(option: any) => option.value === e
                          // );

                          // console.log({
                          // 	productId: selectedVariant?.product_id,
                          // });

                          field.onChange(e)
                        }}
                      />
                    )
                  }}
                />
                {form.formState.errors.variant_id && (
                  <Text className="text-ui-fg-error">Variant is required</Text>
                )}
              </div>
              {/* Min/Max Price Fields */}
              <div>
                <Text className="text-ui-fg-subtle">
                  Cart subtotal Configration
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="min_price" className="text-ui-fg-subtle">
                    Min Price
                  </Label>
                  <Controller
                    control={form.control}
                    name="min_price"
                    render={({ field }) => (
                      <Input
                        id="min_price"
                        type="number"
                        step="0.01"
                        placeholder="Min Price"
                        {...field}
                      />
                    )}
                  />
                  {form.formState.errors.min_price && (
                    <Text className="text-ui-fg-error">
                      Min price is required
                    </Text>
                  )}
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="max_price" className="text-ui-fg-subtle">
                    Max Price
                  </Label>
                  <Controller
                    control={form.control}
                    name="max_price"
                    render={({ field }) => (
                      <Input
                        id="max_price"
                        type="number"
                        step="0.01"
                        placeholder="Max Price"
                        {...field}
                      />
                    )}
                  />
                  {form.formState.errors.max_price && (
                    <Text className="text-ui-fg-error">
                      Max price is required
                    </Text>
                  )}
                </div>
              </div>
            </div>
          </FocusModal.Body>
        </form>
      </FocusModal.Content>
    </FocusModal>
  )
}

export default CreateFreeProductForm
