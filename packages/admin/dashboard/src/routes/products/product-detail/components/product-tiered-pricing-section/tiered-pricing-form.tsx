import { HttpTypes } from "@medusajs/types"
import { Button, IconButton } from "@medusajs/ui"
import { Plus, Trash } from "@medusajs/icons"
import { useMemo } from "react"
import { UseFormReturn, useWatch, useFieldArray } from "react-hook-form"
import { useTranslation } from "react-i18next"

import {
  DataGrid,
  createDataGridHelper,
  createDataGridPriceColumns,
} from "../../../../../components/data-grid"
import { usePricePreferences } from "../../../../../hooks/api/price-preferences"
import { useRegions } from "../../../../../hooks/api/regions"
import { useStore } from "../../../../../hooks/api/store"
import { UpdateTieredPricesSchemaType } from "./tiered-pricing-edit"

type TieredPricingFormProps = {
  form: UseFormReturn<UpdateTieredPricesSchemaType>
  product: HttpTypes.AdminProduct
}

export const TieredPricingForm = ({
  form,
  product,
}: TieredPricingFormProps) => {
  const { store } = useStore()
  const { regions } = useRegions({ limit: 9999 })
  const { price_preferences: pricePreferences } = usePricePreferences({})

  const { append, remove } = useFieldArray({
    control: form.control,
    name: "tiers",
  })

  const columns = useTieredPriceGridColumns({
    currencies: store?.supported_currencies,
    regions,
    pricePreferences,
    onRemove: remove,
  })

  const tiers = useWatch({
    control: form.control,
    name: "tiers",
  }) as any

  const handleAddTier = () => {
    // Add a new tier for the first variant
    const firstVariant = product.variants?.[0]
    if (!firstVariant) {
      return
    }

    append({
      variant_id: firstVariant.id,
      variant_title: firstVariant.title || undefined,
      min_quantity: null,
      max_quantity: null,
      prices: {},
    })
  }

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <p className="text-ui-fg-subtle text-sm">
          Configure price tiers based on quantity ranges for each variant and
          currency/region
        </p>
        <Button
          size="small"
          variant="secondary"
          onClick={handleAddTier}
          type="button"
        >
          <Plus className="mr-2" />
          Add Tier
        </Button>
      </div>
      <DataGrid columns={columns} data={tiers || []} state={form} />
    </div>
  )
}

const columnHelper = createDataGridHelper<any, UpdateTieredPricesSchemaType>()

const useTieredPriceGridColumns = ({
  currencies = [],
  regions = [],
  pricePreferences = [],
  onRemove,
}: {
  currencies?: HttpTypes.AdminStore["supported_currencies"]
  regions?: HttpTypes.AdminRegion[]
  pricePreferences?: HttpTypes.AdminPricePreference[]
  onRemove: (index: number) => void
}) => {
  const { t } = useTranslation()

  return useMemo(() => {
    return [
      columnHelper.column({
        id: "variant_title",
        header: "Variant",
        cell: (context) => {
          return (
            <DataGrid.ReadonlyCell context={context}>
              <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                <span className="truncate">
                  {context.row.original.variant_title || "Unknown"}
                </span>
              </div>
            </DataGrid.ReadonlyCell>
          )
        },
        disableHiding: true,
      }),
      columnHelper.column({
        id: "min_quantity",
        header: "Min Qty",
        field: (context) => `tiers.${context.row.index}.min_quantity`,
        type: "number",
        cell: (context) => {
          return <DataGrid.NumberCell context={context} />
        },
      }),
      columnHelper.column({
        id: "max_quantity",
        header: "Max Qty",
        field: (context) => `tiers.${context.row.index}.max_quantity`,
        type: "number",
        cell: (context) => {
          return <DataGrid.NumberCell context={context} />
        },
      }),
      ...createDataGridPriceColumns<any, UpdateTieredPricesSchemaType>({
        currencies: currencies.map((c) => c.currency_code),
        regions,
        pricePreferences,
        getFieldName: (context, value) => {
          return `tiers.${context.row.index}.prices.${value}`
        },
        t,
      }),
      // columnHelper.column({
      //   id: "actions",
      //   header: "",
      //   cell: (context) => {
      //     return (
      //       <div className="flex items-center justify-end gap-x-2">
      //         <IconButton
      //           variant="transparent"
      //           onClick={() => onRemove(context.row.index)}
      //         >
      //           <Trash />
      //         </IconButton>
      //       </div>
      //     )
      //   },
      // }),
    ]
  }, [t, currencies, regions, pricePreferences, onRemove])
}
