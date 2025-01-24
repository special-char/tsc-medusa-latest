import { Button, Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { HttpTypes } from "@medusajs/types"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { _DataTable } from "../../../../../components/table/data-table"
import { useCollections } from "../../../../../hooks/api/collections"
import { useCollectionTableColumns } from "../../../../../hooks/table/columns/use-collection-table-columns"
import { useCollectionTableFilters } from "../../../../../hooks/table/filters"
import { useCollectionTableQuery } from "../../../../../hooks/table/query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { CollectionRowActions } from "./collection-row-actions"
import { getSalesChannelIds } from "../../../../../const/get-sales-channel"

const PAGE_SIZE = 20

export const CollectionListTable = () => {
  const { t } = useTranslation()
  const salesChannelIds = getSalesChannelIds()
  const { searchParams, raw } = useCollectionTableQuery({ pageSize: PAGE_SIZE })

  // Get all collections for filtering
  const offset = searchParams.offset
  delete searchParams.limit
  delete searchParams.offset
  const {
    collections: allCollections,
    count,
    isError,
    error,
    isLoading,
  } = useCollections(
    {
      fields: "+products.id,*sales_channel.id",
      limit: Number.MAX_SAFE_INTEGER,
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  // Filter all collections first
  const filteredAllCollections =
    salesChannelIds && salesChannelIds[0] && salesChannelIds[0].length != 0
      ? allCollections?.filter(
          (x: any) => x.sales_channel?.id === salesChannelIds[0]
        )
      : allCollections

  // Calculate total filtered count
  const filteredCount = filteredAllCollections?.length ?? 0

  // Apply pagination to filtered results
  const startIndex = offset ?? 0
  const endIndex = startIndex + PAGE_SIZE
  const paginatedCollections = filteredAllCollections?.slice(
    startIndex,
    endIndex
  )

  const filters = useCollectionTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: paginatedCollections ?? [],
    columns,
    count: filteredCount,
    enablePagination: true,
    getRowId: (row, index) => row.id ?? `${index}`,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("collections.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("collections.subtitle")}
          </Text>
        </div>
        <Link to="/collections/create">
          <Button size="small" variant="secondary">
            {t("actions.create")}
          </Button>
        </Link>
      </div>
      <_DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={filteredCount}
        filters={filters}
        orderBy={[
          { key: "title", label: t("fields.title") },
          { key: "handle", label: t("fields.handle") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        search
        navigateTo={(row) => `/collections/${row.original.id}`}
        queryObject={raw}
        isLoading={isLoading}
      />
    </Container>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminCollection>()

const useColumns = () => {
  const base = useCollectionTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <CollectionRowActions collection={row.original} />,
      }),
    ],
    [base]
  )
}
