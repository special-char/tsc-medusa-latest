import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import {
  clx,
  Container,
  Heading,
  Text,
  Button,
  Prompt,
  Input,
  toast,
} from "@medusajs/ui"
import { useEffect, useState } from "react"
import { PencilSquare, Spinner } from "@medusajs/icons"
import { sdk } from "../../../../../lib/client"
import { useForm } from "react-hook-form"
import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const WarrantyFormSchema = zod.object({
  warrantyDays: zod.string().min(1, "Warranty days is required"),
  serviceInterval: zod.string().min(1, "Service interval is required"),
})

type WarrantyFormValues = zod.infer<typeof WarrantyFormSchema>

const VariantWarrantySection = ({
  data: product,
}: DetailWidgetProps<AdminProduct & any>) => {
  const form = useForm<WarrantyFormValues>({
    resolver: zodResolver(WarrantyFormSchema),
    defaultValues: {
      warrantyDays: "",
      serviceInterval: "",
    },
  })

  const [variantData, setVariantData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch variant data
  useEffect(() => {
    const fetchVariantData = async () => {
      try {
        const res = await sdk.admin.product.retrieveVariant(
          product.product_id,
          product.id,
          {
            fields:
              "*inventory_items,*inventory_items.inventory,*inventory_items.inventory.location_levels,*options,*options.option,*prices,*prices.price_rules,*product_warranty_terms",
          }
        )

        setVariantData(res.variant)
        form.reset({
          warrantyDays: res.variant?.metadata?.warrantyDays?.toString() || "",
          serviceInterval: res.variant?.metadata?.serviceInterval?.toString() || "",
        })
      } catch (error) {
        console.error("Error fetching variant data:", error)
      }
    }

    fetchVariantData()
  }, [product.product_id, product.id, form])

  // Update warranty days function
  const onSubmit = async (values: WarrantyFormValues) => {
    try {
      setIsLoading(true)
      const response = await sdk.admin.product.updateVariant(
        product.product_id,
        product.id,
        {
          metadata: {
            ...variantData?.metadata,
            warrantyDays: Number(values.warrantyDays),
            serviceInterval: Number(values.serviceInterval),
          },
        }
      )
      toast.success("Warranty updated successfully")

      // Update local state after successful update
      setVariantData((prev: any) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          warrantyDays: Number(values.warrantyDays),
          serviceInterval: Number(values.serviceInterval),
        },
      }))
    } catch (error) {
      toast.error("There was an error updating the warranty.")
      console.error("Error updating warranty days:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Warranty</Heading>
        <Prompt variant="confirmation">
          <Prompt.Trigger asChild>
            <Button
              size="small"
              variant="secondary"
              className="flex items-center gap-2"
            >
              <PencilSquare />
              Edit
            </Button>
          </Prompt.Trigger>
          <Prompt.Content>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Prompt.Header>
                <Prompt.Title>Edit Warranty</Prompt.Title>
                <Prompt.Description>
                  Please enter the new warranty period in days.
                </Prompt.Description>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Input
                      type="number"
                      min={1}
                      {...form.register("warrantyDays")}
                      placeholder="Warranty period (days)"
                    />
                    {form.formState.errors.warrantyDays && (
                      <p className="mt-1 text-sm text-red-500">
                        {form.formState.errors.warrantyDays.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="number"
                      min={1}
                      {...form.register("serviceInterval")}
                      placeholder="Service interval (days)"
                    />
                    {form.formState.errors.serviceInterval && (
                      <p className="mt-1 text-sm text-red-500">
                        {form.formState.errors.serviceInterval.message}
                      </p>
                    )}
                  </div>
                </div>
              </Prompt.Header>
              <Prompt.Footer>
                <Prompt.Cancel>Cancel</Prompt.Cancel>
                <Prompt.Action
                  type="submit"
                  disabled={isLoading || !form.formState.isValid}
                >
                  {isLoading ? <Spinner className="animate-spin" /> : "Update"}
                </Prompt.Action>
              </Prompt.Footer>
            </form>
          </Prompt.Content>
        </Prompt>
      </div>
      <div
        className={clx(
          `text-ui-fg-subtle grid grid-cols-2 items-center gap-2 px-6 py-4`
        )}
      >
        <Text size="small" weight="plus" leading="compact">
          Duration (Days)
        </Text>
        <Text
          size="small"
          leading="compact"
          className="whitespace-pre-line text-pretty"
        >
          {variantData?.metadata?.warrantyDays || "No Warranty"}
        </Text>
        <Text size="small" weight="plus" leading="compact">
          Service Interval (Days)
        </Text>
        <Text
          size="small"
          leading="compact"
          className="whitespace-pre-line text-pretty"
        >
          {variantData?.metadata?.serviceInterval || "-"}
        </Text>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product_variant.details.side.after",
})

export default VariantWarrantySection
