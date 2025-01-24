import { PencilSquare, Trash } from "@medusajs/icons"
import { AdminProductCategoryResponse } from "@medusajs/types"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useProductCategories } from "../../../../../hooks/api/categories"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useDeleteProductCategoryAction } from "../../../common/hooks/use-delete-product-category-action"
import { useCategoryTableColumns } from "./use-category-table-columns"
import { useCategoryTableQuery } from "./use-category-table-query"
import { getSalesChannelIds } from "../../../../../const/get-sales-channel"

const PAGE_SIZE = 20

export const CategoryListTable = () => {
  const { t } = useTranslation()
  const salesChannelIds = getSalesChannelIds()
  const { raw, searchParams } = useCategoryTableQuery({ pageSize: PAGE_SIZE })

  const query = raw.q
    ? {
        include_ancestors_tree: true,
        fields:
          "id,name,handle,is_active,is_internal,parent_category,*sales_channel.id",
        ...searchParams,
      }
    : {
        include_descendants_tree: true,
        parent_category_id: "null",
        fields:
          "id,name,category_children,handle,is_internal,is_active,*sales_channel.id",
        ...searchParams,
      }
  const offset = query.offset

  const {
    product_categories: allProductCategories,
    count,
    isLoading,
    isError,
    error,
  } = useProductCategories({
    ...query,
    limit: Number.MAX_SAFE_INTEGER,
    offset: 0,
  })

  // Filter all categories first
  const filteredAllCategories =
    salesChannelIds && salesChannelIds[0] && salesChannelIds[0].length != 0
      ? allProductCategories?.filter(
          (x: any) => x?.sales_channel?.id === salesChannelIds[0]
        )
      : allProductCategories

  // Calculate total filtered count
  const filteredCount = filteredAllCategories?.length ?? 0

  // Apply pagination to filtered results
  const startIndex = offset ?? 0
  const endIndex = startIndex + PAGE_SIZE
  const paginatedCategories = filteredAllCategories?.slice(startIndex, endIndex)

  const columns = useColumns()

  const { table } = useDataTable({
    data: paginatedCategories ?? [],
    columns,
    count: filteredCount,
    getRowId: (original) => original.id,
    getSubRows: (original) => original.category_children,
    enableExpandableRows: true,
    pageSize: PAGE_SIZE,
  })

  const showRankingAction =
    !!paginatedCategories && paginatedCategories.length > 0

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("categories.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("categories.subtitle")}
          </Text>
        </div>
        <div className="flex items-center gap-x-2">
          {showRankingAction && (
            <Button size="small" variant="secondary" asChild>
              <Link to="organize">{t("categories.organize.action")}</Link>
            </Button>
          )}
          <Button size="small" variant="secondary" asChild>
            <Link to="create">{t("actions.create")}</Link>
          </Button>
        </div>
      </div>
      <DataTable
        table={table}
        columns={columns}
        count={filteredCount}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        navigateTo={(row) => row.id}
        queryObject={raw}
        search
        pagination
      />
    </Container>
  )
}

const CategoryRowActions = ({
  category,
}: {
  category: AdminProductCategoryResponse["product_category"]
}) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteProductCategoryAction(category)

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              icon: <PencilSquare />,
              to: `${category.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              label: t("actions.delete"),
              icon: <Trash />,
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper =
  createColumnHelper<AdminProductCategoryResponse["product_category"]>()

const useColumns = () => {
  const base = useCategoryTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <CategoryRowActions category={row.original} />
        },
      }),
    ],
    [base]
  )
}
