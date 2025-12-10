import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Text, toast, clx } from "@medusajs/ui"
import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { SortableList } from "../../../../../components/common/sortable-list"
import { useProductVariants } from "../../../../../hooks/api/products"
import { RouteFocusModal } from "../../../../../components/modals"
import { Spinner } from "@medusajs/icons"
import { sdk } from "../../../../../lib/client"
import { queryClient } from "../../../../../lib/query-client"

type VariantSequenceFormProps = {
  product: HttpTypes.AdminProduct
}

type VariantWithRank = HttpTypes.AdminProductVariant & {
  variant_rank: number
}

export const VariantSequenceForm = ({ product }: VariantSequenceFormProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { variants, isPending } = useProductVariants(product.id, {
    limit: 9999,
    order: "variant_rank",
  })

  // Local state for reordered variants
  const [orderedVariants, setOrderedVariants] = useState<VariantWithRank[]>([])

  // Initialize local state when variants load (only once)
  useEffect(() => {
    if (variants && !isPending) {
      setOrderedVariants(
        variants.map((v, index) => ({
          ...v,
          variant_rank: v.variant_rank ?? index,
        })) as VariantWithRank[]
      )
    }
  }, [variants, isPending])

  const [isUpdating, setIsUpdating] = useState(false)

  const handleRankChange = useCallback((items: VariantWithRank[]) => {
    // Update the variant_rank for each item based on new position
    const updated = items.map((item, index) => ({
      ...item,
      variant_rank: index,
    }))
    setOrderedVariants(updated)
  }, [])

  const handleSave = useCallback(async () => {
    setIsUpdating(true)
    try {
      // Optimization: Only update variants whose rank actually changed
      const changedVariants = orderedVariants.filter((variant, index) => {
        const originalVariant = variants?.find((v) => v.id === variant.id)
        return originalVariant?.variant_rank !== index
      })

      if (changedVariants.length === 0) {
        toast.info("No changes to save")
        navigate(`/products/${product.id}`, { replace: true })
        return
      }

      // Update only changed variants in parallel
      await Promise.all(
        changedVariants.map((variant) =>
          sdk.admin.product.updateVariant(product.id, variant.id, {
            variant_rank: variant.variant_rank,
          })
        )
      )

      // Invalidate React Query cache for fresh data
      queryClient.invalidateQueries({
        queryKey: ["product_variants"],
      })
      queryClient.invalidateQueries({
        queryKey: ["products", product.id],
      })

      toast.success(
        `Updated ${changedVariants.length} variant${
          changedVariants.length > 1 ? "s" : ""
        }`
      )
      navigate(`/products/${product.id}`, { replace: true })
    } catch (error: any) {
      console.error("Failed to update variant sequence:", error)
      toast.error("Product Variants Sequence Update Failed", {
        description: error.message || "An error occurred",
      })
    } finally {
      setIsUpdating(false)
    }
  }, [orderedVariants, variants, product.id, navigate])

  if (isPending || orderedVariants.length === 0) {
    return (
      <RouteFocusModal.Body>
        <div className="flex h-full flex-col items-center justify-center gap-y-4">
          <Spinner className="text-ui-fg-interactive animate-spin" />
          <Text className="text-ui-fg-subtle">Loading variants...</Text>
        </div>
      </RouteFocusModal.Body>
    )
  }

  return (
    <>
      <RouteFocusModal.Header>
        <div className="flex items-center justify-end gap-x-2">
          <RouteFocusModal.Close>
            <Button size="small" variant="secondary" type="button">
              {t("actions.cancel")}
            </Button>
          </RouteFocusModal.Close>
          <Button
            size="small"
            onClick={handleSave}
            isLoading={isUpdating}
            disabled={isUpdating}
          >
            {t("actions.save")}
          </Button>
        </div>
      </RouteFocusModal.Header>

      <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-col gap-y-6 p-6">
          <div className="flex flex-col gap-y-2">
            <Heading level="h1">Product Variants Sequence</Heading>
            <Text className="text-ui-fg-subtle">
              Reorder the product variants to change their display order.
            </Text>
          </div>

          <div className="flex flex-col overflow-hidden rounded-xl border">
            {/* Header - Fixed */}
            <div
              className="bg-ui-bg-component text-ui-fg-subtle sticky top-0 z-10 grid items-center gap-3 border-b px-6 py-2.5"
              style={{
                gridTemplateColumns: `28px 200px ${product.options
                  ?.map(() => "1fr")
                  .join(" ")} 120px`,
              }}
            >
              <div />
              <Text size="small" leading="compact" weight="plus">
                {t("fields.title")}
              </Text>
              {product.options?.map((option) => (
                <Text
                  key={option.id}
                  size="small"
                  leading="compact"
                  weight="plus"
                >
                  {option.title}
                </Text>
              ))}
              <Text size="small" leading="compact" weight="plus">
                {t("fields.sku")}
              </Text>
            </div>

            {/* Scrollable Variants Container */}
            <div className="h-full max-h-[calc(100vh-250px)] overflow-y-scroll">
              <SortableList
                items={orderedVariants}
                onChange={handleRankChange}
                renderItem={(item, index) => {
                  return (
                    <SortableList.Item
                      id={item.id}
                      className={clx("bg-ui-bg-base border-b", {
                        "border-b-0": index === orderedVariants.length - 1,
                      })}
                    >
                      <div
                        className="text-ui-fg-subtle grid w-full items-center gap-3 px-6 py-2.5"
                        style={{
                          gridTemplateColumns: `28px 200px ${product.options
                            ?.map(() => "1fr")
                            .join(" ")} 120px`,
                        }}
                      >
                        <SortableList.DragHandle />

                        {/* Title */}
                        <Text size="small" weight="plus" leading="compact">
                          {item.title}
                        </Text>

                        {/* Option Values - one per column */}
                        {product.options?.map((productOption) => {
                          const variantOption = item.options?.find(
                            (opt) => opt.option_id === productOption.id
                          )
                          return (
                            <div
                              key={productOption.id}
                              className="flex items-center"
                            >
                              {variantOption ? (
                                <span className="bg-ui-bg-field text-ui-fg-base ring-ui-border-base inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset">
                                  {variantOption.value}
                                </span>
                              ) : (
                                <Text
                                  size="small"
                                  className="text-ui-fg-muted"
                                  leading="compact"
                                >
                                  -
                                </Text>
                              )}
                            </div>
                          )
                        })}

                        {/* SKU */}
                        <Text
                          size="small"
                          leading="compact"
                          className="text-ui-fg-muted"
                        >
                          {item.sku || "-"}
                        </Text>
                      </div>
                    </SortableList.Item>
                  )
                }}
              />
            </div>
          </div>
        </div>
      </RouteFocusModal.Body>
    </>
  )
}
