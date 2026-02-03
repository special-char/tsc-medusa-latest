import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading } from "@medusajs/ui"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdateProductVariantsBatch } from "../../../../../hooks/api/products"
import { useRegions } from "../../../../../hooks/api/regions"
import { castNumber } from "../../../../../lib/cast-number"
import { TieredPricingForm } from "./tiered-pricing-form"

export const UpdateTieredPricesSchema = zod.object({
  tiers: zod.array(
    zod.object({
      variant_id: zod.string(),
      variant_title: zod.string().optional(),
      min_quantity: zod.preprocess((val) => {
        return val === null || val === "" ? null : Number(val)
      }, zod.number().int().min(1).nullable()),
      max_quantity: zod.preprocess((val) => {
        return val === null || val === "" ? null : Number(val)
      }, zod.number().int().nullable()),
      prices: zod
        .record(zod.string(), zod.string().or(zod.number()).optional())
        .optional(),
    })
  ),
})

export type UpdateTieredPricesSchemaType = zod.infer<
  typeof UpdateTieredPricesSchema
>

export const TieredPricingEdit = ({
  product,
}: {
  product: HttpTypes.AdminProduct
}) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { mutateAsync, isPending } = useUpdateProductVariantsBatch(product.id)

  const { regions } = useRegions({ limit: 9999 })
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

  // Get all existing price tiers grouped by variant
  const existingTiers = useMemo(() => {
    const tiers: any[] = []

    product.variants?.forEach((variant) => {
      // Group prices by their tier (min_quantity, max_quantity combo)
      const tierGroups = new Map<string, any>()

      variant.prices?.forEach((price: any) => {
        const tierKey = `${price.min_quantity || ""}-${
          price.max_quantity || ""
        }`

        if (!tierGroups.has(tierKey)) {
          tierGroups.set(tierKey, {
            variant_id: variant.id,
            variant_title: variant.title,
            min_quantity: price.min_quantity
              ? Number(price.min_quantity)
              : null,
            max_quantity: price.max_quantity
              ? Number(price.max_quantity)
              : null,
            prices: {},
          })
        }

        const tier = tierGroups.get(tierKey)
        if (price.rules?.region_id) {
          tier.prices[price.rules.region_id] = price.amount
        } else {
          tier.prices[price.currency_code] = price.amount
        }
      })

      tiers.push(...Array.from(tierGroups.values()))
    })

    return tiers
  }, [product.variants])

  const form = useForm<UpdateTieredPricesSchemaType>({
    defaultValues: {
      tiers: existingTiers.length > 0 ? existingTiers : [],
    },
    resolver: zodResolver(UpdateTieredPricesSchema),
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    // Group tiers by variant
    const variantUpdates = new Map<string, any[]>()

    values.tiers.forEach((tier) => {
      if (!variantUpdates.has(tier.variant_id)) {
        variantUpdates.set(tier.variant_id, [])
      }

      const variantPrices = variantUpdates.get(tier.variant_id)!

      Object.entries(tier.prices || {}).forEach(
        ([currencyCodeOrRegionId, value]: any) => {
          if (value === "" || typeof value === "undefined") {
            return // Skip empty cells
          }

          const regionId = currencyCodeOrRegionId.startsWith("reg_")
            ? currencyCodeOrRegionId
            : undefined
          const currencyCode = currencyCodeOrRegionId.startsWith("reg_")
            ? regionsCurrencyMap[regionId!]
            : currencyCodeOrRegionId

          const amount = castNumber(value)

          variantPrices.push({
            currency_code: currencyCode,
            amount,
            min_quantity: tier.min_quantity,
            max_quantity: tier.max_quantity,
            ...(regionId ? { rules: { region_id: regionId } } : {}),
          })
        }
      )
    })

    const reqData = Array.from(variantUpdates.entries()).map(
      ([variantId, prices]) => ({
        id: variantId,
        prices,
      })
    )

    await mutateAsync(reqData, {
      onSuccess: () => {
        handleSuccess("..")
      },
    })
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm onSubmit={handleSubmit} className="flex size-full flex-col">
        <RouteFocusModal.Header>
          <div className="flex items-center">
            <Heading level="h1">Tiered Pricing</Heading>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-col overflow-hidden">
          <TieredPricingForm form={form as any} product={product} />
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex w-full items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              type="submit"
              variant="primary"
              size="small"
              isLoading={isPending}
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
