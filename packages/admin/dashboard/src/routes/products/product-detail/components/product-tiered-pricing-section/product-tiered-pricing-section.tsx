import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Button, Switch, Label, toast } from "@medusajs/ui"
import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useMutation } from "@tanstack/react-query"
import { sdk } from "../../../../../lib/client"
import { useProduct } from "../../../../../hooks/api/products"

type ProductTieredPricingSectionProps = {
  product: HttpTypes.AdminProduct
}

export function ProductTieredPricingSection({
  product: _product,
}: ProductTieredPricingSectionProps) {
  const navigate = useNavigate()
  const { id } = useParams()

  // Fetch product with variants and metadata
  const { product, isLoading } = useProduct(id!, {
    fields: "+variants,+metadata",
  })

  // Memoize computed values
  const variantCount = useMemo(
    () => product?.variants?.length || 0,
    [product?.variants?.length]
  )
  const isSingleVariant = variantCount === 1

  // Toggle state synced with metadata
  const [tieredPricingEnabled, setTieredPricingEnabled] = useState(false)

  useEffect(() => {
    if (product?.metadata?.tieredPricing !== undefined) {
      setTieredPricingEnabled(product.metadata.tieredPricing === true)
    }
  }, [product?.metadata?.tieredPricing])

  // Mutation to update product metadata
  const { mutate, isPending } = useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!product) {
        return
      }

      await sdk.admin.product.update(product.id, {
        metadata: {
          ...product.metadata,
          tieredPricing: enabled,
        },
      })
    },
    onError: (error) => {
      toast.error("Failed to update tiered pricing status.", {
        description: error.message || "An unexpected error occurred.",
      })
      // Revert state on error
      setTieredPricingEnabled((prev) => !prev)
    },
    onSuccess: () => {
      toast.success("Tiered pricing status updated successfully.")
    },
  })

  const handleToggleChange = useCallback(
    (checked: boolean) => {
      setTieredPricingEnabled(checked)
      mutate(checked)
    },
    [mutate]
  )

  const handleManageTiers = useCallback(() => {
    navigate("tiered-pricing")
  }, [navigate])

  // Loading state
  if (isLoading || !product) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Tiered Pricing</Heading>
          <p className="text-ui-fg-subtle mt-1 text-sm">Loading...</p>
        </div>
      </Container>
    )
  }

  // Multi-variant message
  if (!isSingleVariant) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Tiered Pricing</Heading>
          <p className="text-ui-fg-subtle mt-1 text-sm">
            Tiered pricing is only available for products with a single variant.
            This product has {variantCount} variants.
          </p>
        </div>
      </Container>
    )
  }

  // Main UI for single-variant products
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Tiered Pricing</Heading>
          <p className="text-ui-fg-subtle mt-1 text-sm">
            Set different prices based on quantity purchased
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="tiered-pricing-toggle"
              className="text-ui-fg-subtle text-sm font-medium"
            >
              Enable Tiered Pricing
            </Label>
            <Switch
              id="tiered-pricing-toggle"
              disabled={isPending}
              checked={tieredPricingEnabled}
              onCheckedChange={handleToggleChange}
            />
          </div>
          {tieredPricingEnabled && (
            <Button
              variant="secondary"
              size="small"
              onClick={handleManageTiers}
            >
              Manage Tiers
            </Button>
          )}
        </div>
      </div>
    </Container>
  )
}
