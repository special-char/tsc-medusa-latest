import { PencilSquare, Plus } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import { RowSelectionState } from "@tanstack/react-table"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
// import { useProductVariantTableQuery } from "../../products/product-detail/components/product-variant-section/use-variant-table-query"
import { useProductVariants } from "../../../hooks/api"
// import { useProductVariantTableFilters } from "../../products/product-detail/components/product-variant-section/use-variant-table-filters"

import { useDataTable } from "../../../hooks/use-data-table"
import { PRODUCT_VARIANT_IDS_KEY } from "../../products/common/constants"
import { ActionMenu } from "../../../components/common/action-menu"
import { useProductGiftVariantTableColumns } from "./use-variant-section"
import { DataTable } from "../../../components/data-table"

type ProductVariantSectionProps = {
  product: HttpTypes.AdminProduct
}

const PAGE_SIZE = 10

export const GiftVariantSection = ({ product }: ProductVariantSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // const { searchParams, raw } = useProductVariantTableQuery({
  //   pageSize: PAGE_SIZE,
  // })
  const { variants, count, isLoading, isError, error } = useProductVariants(
    product.id,
    {
      // ...searchParams,
      fields: "*inventory_items.inventory.location_levels,+inventory_quantity",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const [selection, setSelection] = useState<RowSelectionState>({})

  // const filters = useProductVariantTableFilters()
  const columns = useProductGiftVariantTableColumns(product)

  const { table } = useDataTable({
    data: variants ?? [],
    columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
    enableRowSelection: true,
    rowSelection: {
      state: selection,
      updater: setSelection,
    },
    meta: {
      product,
    },
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Denominations</Heading>
        {/* <Heading level="h2">{t("products.variants")}</Heading> */}
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: "Add Denominations",
                  to: `add-denomination`,
                  icon: <Plus />,
                },
                {
                  label: t("products.editPrices"),
                  to: `prices`,
                  icon: <PencilSquare />,
                },
                // {
                //   label: t("inventory.stock.action"),
                //   to: `stock`,
                //   icon: <Buildings />,
                // },
              ],
            },
          ]}
        />
      </div>
      {/* <DataTable
        table={table}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        orderBy={[
          { key: "title", label: t("fields.title") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        navigateTo={(row) =>
          `/products/${row.original.product_id}/variants/${row.id}`
        }
        pagination
        search
        queryObject={raw}
        commands={[
          {
            action: async (selection) => {
              navigate(
                `stock?${PRODUCT_VARIANT_IDS_KEY}=${Object.keys(selection).join(
                  ","
                )}`
              )
            },
            label: t("inventory.stock.action"),
            shortcut: "i",
          },
        ]}
      /> */}
    </Container>
  )
}
