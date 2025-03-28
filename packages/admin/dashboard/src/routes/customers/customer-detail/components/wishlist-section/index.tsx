import { AdminCustomer, AdminProductVariant } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import { useDataTable } from "../../../../../hooks/use-data-table.tsx"
import { sdk } from "../../../../../lib/client/client.ts"
import { _DataTable } from "../../../../../components/table/data-table"
import { ProductHeader } from "../../../../../components/table/table-cells/product/product-cell/product-cell.tsx"
import { useVariantTableQuery } from "../../../../../hooks/table/query/use-variant-table-query.tsx"
import { Thumbnail } from "../../../../../components/common/thumbnail/thumbnail.tsx"

const VARIANT_PAGE_SIZE = 10
const VARIANT_PREFIX = "variant"

const variantColumnHelper = createColumnHelper<AdminProductVariant>()

const useVariantColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      variantColumnHelper.display({
        id: "variant",
        header: () => (
          <div className="flex h-full w-full items-center">
            <span>Variant</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex h-full w-full max-w-[250px] items-center gap-x-3 overflow-hidden">
            <div className="w-fit flex-shrink-0">
              <Thumbnail src={row.original.product?.thumbnail} />
            </div>
            <span title={row.original?.title || ""} className="truncate">
              {row.original?.title}
            </span>
          </div>
        ),
      }),
      variantColumnHelper.display({
        id: "product",
        header: () => <ProductHeader />,
        cell: ({ row }) => (
          <div className="text-sm text-gray-500">
            {row.original.product?.title}
          </div>
        ),
      }),
    ],
    [t]
  )
}

export const WishlistSection = ({ customer }: { customer: AdminCustomer }) => {
  const { searchParams, raw } = useVariantTableQuery({
    pageSize: VARIANT_PAGE_SIZE,
    prefix: VARIANT_PREFIX,
  })

  // Get wishlist data
  const { data: wishlistData } = useQuery({
    queryFn: () => sdk.admin.wishlist.retrieve(customer.id),
    queryKey: ["wishlist", customer.id],
  })

  // Memoize variant IDs to prevent unnecessary recalculations
  const wishlistVariantIds = useMemo(
    () => wishlistData?.variants?.map((x: AdminProductVariant) => x.id) || [],
    [wishlistData?.variants]
  )

  // Get variant data
  const { data: variantList, isLoading } = useQuery({
    queryFn: () =>
      sdk.admin.productVariant.list({
        id: wishlistVariantIds,
        ...searchParams,
      }),
    queryKey: [
      "variants",
      wishlistVariantIds,
      searchParams.q,
      searchParams.limit,
      searchParams.offset,
      searchParams.created_at,
      searchParams.updated_at,
      searchParams.order,
    ],
    enabled: wishlistVariantIds.length > 0,
  })

  const columns = useVariantColumns()

  // Memoize table configuration
  const tableConfig = useMemo(
    () => ({
      data: variantList?.variants ?? [],
      columns,
      getRowId: (original: AdminProductVariant) => original.id,
      count: variantList?.count ?? 0,
      pageSize: VARIANT_PAGE_SIZE,
      prefix: VARIANT_PREFIX,
      enablePagination: true,
    }),
    [variantList, columns]
  )

  const { table } = useDataTable(tableConfig)

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Wishlist Items</Heading>
      </div>

      <_DataTable
        table={table}
        columns={columns}
        pageSize={VARIANT_PAGE_SIZE}
        count={variantList?.count ?? 0}
        navigateTo={(row) =>
          `/products/${row.original.product?.id}/variants/${row.original.id}`
        }
        orderBy={[
          { key: "title", label: "Title" },
          { key: "created_at", label: "Created At" },
          { key: "updated_at", label: "Updated At" },
        ]}
        queryObject={raw}
        prefix={VARIANT_PREFIX}
        pagination
        search="autofocus"
        isLoading={isLoading}
        noRecords={{
          title: "No Wishlist Found",
          message: "No Wishlist items found for this user",
        }}
      />
    </Container>
  )
}
