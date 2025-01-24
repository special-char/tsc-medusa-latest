import { InventoryTypes } from "@medusajs/types"
import { Button, Container, Heading, Text } from "@medusajs/ui"

import { RowSelectionState } from "@tanstack/react-table"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { _DataTable } from "../../../../components/table/data-table"
import { useInventoryItems } from "../../../../hooks/api/inventory"
import { useDataTable } from "../../../../hooks/use-data-table"
import { INVENTORY_ITEM_IDS_KEY } from "../../common/constants"
import { useInventoryTableColumns } from "./use-inventory-table-columns"
import { useInventoryTableFilters } from "./use-inventory-table-filters"
import { useInventoryTableQuery } from "./use-inventory-table-query"
import { getSalesChannelIds } from "../../../../const/get-sales-channel"

const PAGE_SIZE = 20

export const InventoryListTable = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [selection, setSelection] = useState<RowSelectionState>({})

  const { searchParams, raw } = useInventoryTableQuery({
    pageSize: PAGE_SIZE,
  })

  const {
    inventory_items: allItems,
    isPending: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
  } = useInventoryItems({
    fields: "*variants.product.sales_channels",
    limit: Number.MAX_SAFE_INTEGER,
  })

  const salesChannelIds = getSalesChannelIds()
  const filters = useInventoryTableFilters()
  const columns = useInventoryTableColumns()

  // More robust filtering logic
  const filteredItems =
    salesChannelIds.length === 0
      ? allItems
      : allItems?.filter((item: any) => {
          // Check if variants exist
          if (!item?.variants || !Array.isArray(item.variants)) {
            return false
          }

          // Check if any variant matches the sales channel criteria
          return item.variants.some((variant: any) => {
            if (!variant?.product?.sales_channels) {
              return false
            }
            return variant.product.sales_channels.some((channel: any) =>
              salesChannelIds.includes(channel.id)
            )
          })
        })

  const filteredCount = filteredItems?.length ?? 0

  // Ensure pagination values are valid numbers
  const offset = Math.max(0, searchParams.offset ?? 0)
  const startIndex = offset
  const endIndex = startIndex + PAGE_SIZE
  const paginatedItems = filteredItems?.slice(startIndex, endIndex)

  const { table } = useDataTable({
    data:
      (paginatedItems as InventoryTypes.InventoryItemDTO[]) ??
      ([] as InventoryTypes.InventoryItemDTO[]),
    columns,
    count: filteredCount,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    enableRowSelection: true,
    rowSelection: {
      state: selection,
      updater: setSelection,
    },
  })

  if (isErrorAll) {
    throw errorAll
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("inventory.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("inventory.subtitle")}
          </Text>
        </div>
        <Button size="small" variant="secondary" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>
      <_DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={filteredCount}
        isLoading={isLoadingAll}
        pagination
        search
        filters={filters}
        queryObject={raw}
        orderBy={[
          { key: "title", label: t("fields.title") },
          { key: "sku", label: t("fields.sku") },
          { key: "stocked_quantity", label: t("fields.inStock") },
          { key: "reserved_quantity", label: t("inventory.reserved") },
        ]}
        navigateTo={(row) => `${row.id}`}
        commands={[
          {
            action: async (selection) => {
              navigate(
                `stock?${INVENTORY_ITEM_IDS_KEY}=${Object.keys(selection).join(
                  ","
                )}`
              )
            },
            label: t("inventory.stock.action"),
            shortcut: "i",
          },
        ]}
      />
    </Container>
  )
}
