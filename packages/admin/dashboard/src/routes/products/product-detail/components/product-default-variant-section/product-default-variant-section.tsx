import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Select, toast } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { useUpdateProduct } from "../../../../../hooks/api/products"
import { useProductVariants } from "../../../../../hooks/api/products"

type ProductDefaultVariantSectionProps = {
  product: HttpTypes.AdminProduct | any
}

export const ProductDefaultVariantSection = ({
  product,
}: ProductDefaultVariantSectionProps) => {
  const { mutateAsync, isPending } = useUpdateProduct(product.id)

  // Fetch variants using the hook
  const { variants: fetchedVariants, isPending: isLoadingVariants } =
    useProductVariants(product.id, {
      limit: 1000, // Get all variants
      fields: "id,title,options,metadata",
    })

  // Get the current default variant from metadata
  const currentDefaultVariant = product.metadata?.default_variant as
    | string
    | undefined

  const [selectedVariant, setSelectedVariant] = useState<string>(
    currentDefaultVariant || ""
  )

  // Update local state when product metadata changes
  useEffect(() => {
    if (currentDefaultVariant) {
      setSelectedVariant(currentDefaultVariant)
    }
  }, [currentDefaultVariant])

  const handleVariantChange = async (value: string) => {
    // Find the selected variant to check if it's a draft
    const selectedVariantData = variants.find((v: any) => v.id === value)

    // Check if the selected variant is a draft variant
    if (selectedVariantData?.metadata?.isDraft === true) {
      toast.error("Cannot set draft variant as default", {
        description: "You cannot set a draft variant as the default variant",
      })
      return
    }

    setSelectedVariant(value)

    try {
      await mutateAsync({
        metadata: {
          ...product.metadata,
          default_variant: value,
        },
      })
      toast.success("Success", {
        description: "Default variant updated successfully",
      })
    } catch (error) {
      console.error("Error updating default variant:", error)
      toast.error("Error", {
        description: "Failed to update default variant",
      })
      // Revert to previous value on error
      setSelectedVariant(currentDefaultVariant || "")
    }
  }

  const variants = fetchedVariants || []

  // Helper function to format variant title
  const getVariantTitle = (variant: any) => {
    if (!variant) {
      return "Unknown variant"
    }

    if (variant.title && variant.title !== "Default Variant") {
      return variant.title
    }
    // Fallback to option values if no title
    if (variant.options && variant.options.length > 0) {
      return variant.options.map((opt: any) => opt.value).join(" / ")
    }
    return `Variant ${variant.id}`
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Default Variant</Heading>
      </div>

      <div className="px-6 py-4">
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="default-variant-select"
            className="txt-compact-small text-ui-fg-subtle"
          >
            Select default variant for this product
          </label>
          <Select
            value={selectedVariant}
            onValueChange={handleVariantChange}
            disabled={isPending || isLoadingVariants || variants.length === 0}
          >
            <Select.Trigger id="default-variant-select">
              <Select.Value placeholder="Select a variant" />
            </Select.Trigger>
            <Select.Content>
              {variants.map((variant: any) => (
                <Select.Item key={variant.id} value={variant.id}>
                  {getVariantTitle(variant)}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
          {selectedVariant && (
            <p className="txt-compact-small text-ui-fg-subtle">
              Current default:{" "}
              {(() => {
                const foundVariant = variants.find(
                  (v: any) => v.id === selectedVariant
                )
                return foundVariant
                  ? getVariantTitle(foundVariant)
                  : selectedVariant
              })()}
            </p>
          )}
        </div>
      </div>
    </Container>
  )
}
