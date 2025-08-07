import { Button, Container, Heading, Label, toast } from "@medusajs/ui"
import { useFieldArray, useForm, Controller } from "react-hook-form"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../lib/client"
import { Combobox } from "../../../../../components/inputs/combobox"
import { useMemo, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { AdminProductVariant } from "@medusajs/types"
import { useUpdateProductVariant } from "../../../../../hooks/api"
import CustomSearchableSelect from "../../../../../components/custom/components/form/CustomSearchableSelect"

type Variant = {
  id: string
  title: string
  product: {
    id: string
    title: string
    handle: string
  }
}

type FormType = {
  cross_sell: {
    variant_id: string
  }[]
}

export function VariantCrossSell({
  variant,
}: {
  variant: AdminProductVariant
}) {
  const queryClient = useQueryClient()

  const { control, handleSubmit } = useForm<FormType>({
    defaultValues: {
      cross_sell: variant.metadata?.cross_sell
        ? (variant.metadata?.cross_sell as any)
        : [{ variant_id: "" }],
    },
  })

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "cross_sell",
  })

  const { mutateAsync, isPending } = useUpdateProductVariant(
    variant.product_id!,
    variant.id
  )

  const variantList = useComboboxData({
    queryKey: ["products"],
    queryFn: useCallback(
      async (params: any) => {
        // Cache the results for 5 minutes
        const cachedData = queryClient.getQueryData(["products", params])
        if (cachedData) {
          return cachedData
        }

        const response = await sdk.admin.product.list({
          ...params,
          fields: "id,title,handle,*variants.title",
          limit: 9999,
        })

        queryClient.setQueryData(["products", params], response)
        return response
      },
      [queryClient]
    ),
    getOptions: useCallback((data: any) => {
      if (!data?.products?.length) {
        return []
      }

      const variants = data.products.flatMap((product: any) =>
        product.variants
          .filter((x: any) => x.id !== variant.id)
          .map((variant: any) => ({
            ...variant,
            product: {
              id: product.id,
              title: product.title,
              handle: product.handle,
            },
          }))
      )

      return variants.map((variant: Variant) => ({
        label: `${variant.title} - ${variant.product.title}`,
        value: variant.id,
        product: variant.product,
      }))
    }, []),
  })

  const onSubmit = useCallback((data: FormType) => {
    console.log("Form data:", data)
    // Handle form submission here
    mutateAsync(
      {
        metadata: {
          ...variant?.metadata,
          ...data,
        },
      },
      {
        onSuccess: () => {
          toast.success("Successfully updated")
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }, [])

  const handleAppend = useCallback(() => {
    append({ variant_id: "" })
  }, [append])

  const handleRemove = useCallback(
    (index: number) => {
      if (fields.length <= 1) {
        update(index, { variant_id: "" }) // Reset the field instead of removing it
        return // Prevent removing the last field
      }
      remove(index)
    },
    [remove]
  )

  // Memoize the options to prevent unnecessary re-renders
  const comboboxOptions = useMemo(
    () => variantList.options,
    [variantList.options]
  )

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center gap-2 px-6 py-4">
        <Heading level="h2">Cross Sell Products</Heading>
      </div>

      <div className="px-6 py-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-y-4">
            {/* Variants Field Array */}
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-x-4">
                <div className="flex-1 space-y-2">
                  <Label>Variant {index + 1}</Label>
                  <Controller
                    control={control}
                    name={`cross_sell.${index}.variant_id`}
                    rules={{ required: "Variant is required" }}
                    render={({ field }) => (
                      // <Combobox
                      //   {...field}
                      //   options={comboboxOptions}
                      //   searchValue={variantList.searchValue}
                      //   onSearchValueChange={variantList.onSearchValueChange}
                      // />
                      <CustomSearchableSelect
                        {...field}
                        options={comboboxOptions}
                        displayCount={100}
                        placeholder="Search variant"
                      />
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="secondary"
              onClick={handleAppend}
              disabled={fields.length >= 3}
            >
              Add Variant
            </Button>
          </div>

          <Button type="submit">Save Changes</Button>
        </form>
      </div>
    </Container>
  )
}
