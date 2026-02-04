import { HttpTypes } from "@medusajs/types"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { Thumbnail } from "../../../../components/common/thumbnail"
import {
  createDataGridHelper,
  DataGrid,
} from "../../../../components/data-grid"
import { createDataGridPriceColumns } from "../../../../components/data-grid/helpers/create-data-grid-price-columns"
import { PricingCreateSchemaType } from "../../price-list-create/components/price-list-create-form/schema"
import { SyncedQuantityCell } from "../components/synced-quantity-cell"
import { isProductRow } from "../utils"

const columnHelper = createDataGridHelper<
  HttpTypes.AdminProduct | HttpTypes.AdminProductVariant,
  PricingCreateSchemaType
>()

export const usePriceListGridColumns = ({
  currencies = [],
  regions = [],
  pricePreferences = [],
}: {
  currencies?: HttpTypes.AdminStoreCurrency[]
  regions?: HttpTypes.AdminRegion[]
  pricePreferences?: HttpTypes.AdminPricePreference[]
}) => {
  const { t } = useTranslation()

  const colDefs: ColumnDef<
    HttpTypes.AdminProduct | HttpTypes.AdminProductVariant
  >[] = useMemo(() => {
    return [
      columnHelper.column({
        id: t("fields.title"),
        header: t("fields.title"),
        cell: (context) => {
          const entity = context.row.original
          if (isProductRow(entity)) {
            return (
              <DataGrid.ReadonlyCell context={context}>
                <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                  <Thumbnail src={entity.thumbnail} size="small" />
                  <span className="truncate">{entity.title}</span>
                </div>
              </DataGrid.ReadonlyCell>
            )
          }

          return (
            <DataGrid.ReadonlyCell context={context} color="normal">
              <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                <span className="truncate">{entity.title}</span>
              </div>
            </DataGrid.ReadonlyCell>
          )
        },
        disableHiding: true,
      }),
      columnHelper.column({
        id: "min_quantity",
        header: "Minimum Quantity",
        field: ({ row }) => {
          const entity = row.original
          if (isProductRow(entity)) {
            return `products.${entity.id}.min_quantity` as any
          }

          // Use the first available currency or region from the configuration
          const firstCurrency = currencies?.[0]?.currency_code
          const firstRegion = regions?.[0]?.id

          if (firstCurrency) {
            return `products.${entity.product_id}.variants.${entity.id}.currency_prices.${firstCurrency}.min_quantity` as any
          } else if (firstRegion) {
            return `products.${entity.product_id}.variants.${entity.id}.region_prices.${firstRegion}.min_quantity` as any
          }

          // Default fallback
          return `products.${entity.product_id}.variants.${entity.id}.min_quantity` as any
        },
        type: "number",
        cell: (context) => {
          const entity = context.row.original
          if (isProductRow(entity)) {
            return <DataGrid.ReadonlyCell context={context} />
          }
          return (
            <SyncedQuantityCell
              context={context}
              variant={entity}
              currencies={currencies}
              regions={regions}
              quantityField="min_quantity"
            />
          )
        },
      }),
      columnHelper.column({
        id: "max_quantity",
        header: "Maximum Quantity",
        field: ({ row }) => {
          const entity = row.original
          if (isProductRow(entity)) {
            return `products.${entity.id}.max_quantity` as any
          }

          // Use the first available currency or region from the configuration
          const firstCurrency = currencies?.[0]?.currency_code
          const firstRegion = regions?.[0]?.id

          if (firstCurrency) {
            return `products.${entity.product_id}.variants.${entity.id}.currency_prices.${firstCurrency}.max_quantity` as any
          } else if (firstRegion) {
            return `products.${entity.product_id}.variants.${entity.id}.region_prices.${firstRegion}.max_quantity` as any
          }

          // Default fallback
          return `products.${entity.product_id}.variants.${entity.id}.max_quantity` as any
        },
        type: "number",
        cell: (context) => {
          const entity = context.row.original
          if (isProductRow(entity)) {
            return <DataGrid.ReadonlyCell context={context} />
          }
          return (
            <SyncedQuantityCell
              context={context}
              variant={entity}
              currencies={currencies}
              regions={regions}
              quantityField="max_quantity"
            />
          )
        },
      }),
      ...createDataGridPriceColumns<
        HttpTypes.AdminProduct | HttpTypes.AdminProductVariant,
        PricingCreateSchemaType
      >({
        currencies: currencies.map((c) => c.currency_code),
        regions,
        pricePreferences,
        isReadyOnly: (context) => {
          const entity = context.row.original
          return isProductRow(entity)
        },
        getFieldName: (context, value) => {
          const entity = context.row.original

          if (isProductRow(entity)) {
            return null
          }

          if (context.column.id?.startsWith("currency_prices")) {
            return `products.${entity.product_id}.variants.${entity.id}.currency_prices.${value}.amount`
          }

          return `products.${entity.product_id}.variants.${entity.id}.region_prices.${value}.amount`
        },
        t,
      }),
    ]
  }, [t, currencies, regions, pricePreferences])

  return colDefs
}
