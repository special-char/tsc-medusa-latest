import { HttpTypes } from "@medusajs/types"
import { Button, Container, Heading, Select, toast } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { useUpdateProduct } from "../../../../../hooks/api/products"
import { useProductOptions } from "../../../../../widgets/product-option-images/hooks/useProductOptions"

type VariantAsProductSectionProps = {
  product: HttpTypes.AdminProduct | any
}

export const VariantAsProductSection = ({
  product,
}: VariantAsProductSectionProps) => {
  const { mutateAsync, isPending: isUpdating } = useUpdateProduct(product.id)

  // Fetch options specifically from the API
  const { product_options, isLoading: isLoadingOptions } = useProductOptions(
    product.id,
    {
      fields: "*values",
    }
  )

  // Filter options with more than one value
  const options = (product_options || []).filter(
    (option: any) => (option.values?.length || 0) > 1
  )

  // Get current metadata value
  const currentValue = (product.metadata?.variant_as_product as string) || ""

  const [selectedOption, setSelectedOption] = useState<string>(currentValue)

  // Keep local state in sync with product metadata
  useEffect(() => {
    setSelectedOption(currentValue)
  }, [currentValue])

  const handleOptionChange = async (value: string) => {
    setSelectedOption(value)

    try {
      await mutateAsync({
        metadata: {
          ...product.metadata,
          variant_as_product: value,
        },
      })
      toast.success("Success", {
        description: "Variant as product updated successfully",
      })
    } catch (error) {
      console.error("Error updating variant as product:", error)
      toast.error("Error", {
        description: "Failed to update variant as product",
      })
      // Revert to previous value
      setSelectedOption(currentValue)
    }
  }

  const handleClear = async () => {
    setSelectedOption("")
    try {
      await mutateAsync({
        metadata: {
          ...product.metadata,
          variant_as_product: "",
        },
      })
      toast.success("Success", {
        description: "Variant as product cleared",
      })
    } catch (error) {
      console.error("Error clearing variant as product:", error)
      toast.error("Error", {
        description: "Failed to clear variant as product",
      })
      // Revert to previous value
      setSelectedOption(currentValue)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Variant as Product</Heading>
        {selectedOption && (
          <Button
            variant="transparent"
            size="small"
            onClick={handleClear}
            className="text-ui-fg-subtle hover:text-ui-fg-base"
            disabled={isUpdating || isLoadingOptions}
          >
            Clear
          </Button>
        )}
      </div>

      <div className="px-6 py-4">
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="variant-as-product-select"
            className="txt-compact-small text-ui-fg-subtle"
          >
            Select which option determines when a variant should be treated as a product
          </label>
          <Select
            value={selectedOption}
            onValueChange={handleOptionChange}
            disabled={isUpdating || isLoadingOptions || options.length === 0}
          >
            <Select.Trigger id="variant-as-product-select">
              <Select.Value placeholder="Select an option" />
            </Select.Trigger>
            <Select.Content>
              {options.map((option: any) => (
                <Select.Item key={option.id} value={option.id}>
                  {option.title}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
          {selectedOption && (
            <p className="txt-compact-small text-ui-fg-subtle">
              Current selection:{" "}
              {options.find((o: any) => o.id === selectedOption)?.title ||
                selectedOption}
            </p>
          )}
          {options.length === 0 && !isLoadingOptions && (
            <p className="txt-compact-small text-ui-fg-muted">
              No options with multiple values available.
            </p>
          )}
          {isLoadingOptions && (
            <p className="txt-compact-small text-ui-fg-muted">
              Loading options...
            </p>
          )}
        </div>
      </div>
    </Container>
  )
}
