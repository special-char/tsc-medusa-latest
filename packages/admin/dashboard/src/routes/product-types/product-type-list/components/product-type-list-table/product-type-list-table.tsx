import { HttpTypes } from "@medusajs/types"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { DataTable } from "../../../../../components/table/data-table"
import { useProductTypes } from "../../../../../hooks/api/product-types"
import { useProductTypeTableColumns } from "../../../../../hooks/table/columns/use-product-type-table-columns"
import { useProductTypeTableFilters } from "../../../../../hooks/table/filters/use-product-type-table-filters"
import { useProductTypeTableQuery } from "../../../../../hooks/table/query/use-product-type-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { ProductTypeRowActions } from "./product-table-row-actions"
import { getSalesChannelIds } from "../../../../../const/get-sales-channel"

const PAGE_SIZE = 20

export const ProductTypeListTable = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = useProductTypeTableQuery({
    pageSize: PAGE_SIZE,
  })
  const salesChannelIds = getSalesChannelIds()
  const {
    product_types: allTypes,
    count: totalCount,
    isLoading,
    isError,
    error,
  } = useProductTypes(
    {
      ...searchParams,
      fields: "*sales_channel.id",
      limit: Number.MAX_SAFE_INTEGER,
      offset: 0,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  // Filter current page data
  const filteredTypes =
    salesChannelIds && salesChannelIds[0] && salesChannelIds[0].length != 0
      ? allTypes?.filter((x: any) => x.sales_channel?.id === salesChannelIds[0])
      : allTypes

  // Calculate total filtered count
  const filteredCount = filteredTypes?.length ?? 0

  // Apply pagination to filtered results
  const startIndex = searchParams.offset ?? 0
  const endIndex = startIndex + PAGE_SIZE
  const paginatedTypes = filteredTypes?.slice(startIndex, endIndex)

  const filters = useProductTypeTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    columns,
    data: paginatedTypes ?? [],
    count: filteredCount,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("productTypes.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("productTypes.subtitle")}
          </Text>
        </div>
        <Button size="small" variant="secondary" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>
      <DataTable
        table={table}
        filters={filters}
        isLoading={isLoading}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={filteredCount}
        orderBy={[
          { key: "value", label: t("fields.value") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        navigateTo={({ original }) => original.id}
        queryObject={raw}
        pagination
        search
      />
    </Container>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminProductType>()

const useColumns = () => {
  const base = useProductTypeTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <ProductTypeRowActions productType={row.original} />
        },
      }),
    ],
    [base]
  )
}
