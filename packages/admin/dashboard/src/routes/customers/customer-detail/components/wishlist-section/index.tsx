import { AdminProduct, AdminProductVariant, HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"

import { useDataTable } from "../../../../../hooks/use-data-table.tsx"
import { sdk } from "../../../../../lib/client/client.ts"
import { _DataTable } from "../../../../../components/table/data-table"
import { useTranslation } from "react-i18next"
import { ProductHeader } from "../../../../../components/table/table-cells/product/product-cell/product-cell.tsx"
import { useVariantTableQuery } from "../../../../../hooks/table/query/use-variant-table-query.tsx"
import { Thumbnail } from "../../../../../components/common/thumbnail/thumbnail.tsx"
import { useQuery } from "@tanstack/react-query"

type CustomerGroupSectionProps = {
  customer: HttpTypes.AdminCustomer
}

const VARIANT_PAGE_SIZE = 10
const VARIANT_PREFIX = "variant"

const fetchWishlists = async (customerId: string) => {
  try {
    const res = await sdk.admin.wishlist.retrieve(customerId)

    return res
  } catch (error) {
    console.error("Error in fetchWishlists:", error)
    return {
      wishlist: [],
      products: [],
    }
  }
}

export const WishlistSection = ({ customer }: CustomerGroupSectionProps) => {
  const { searchParams, raw } = useVariantTableQuery({
    pageSize: VARIANT_PAGE_SIZE,
    prefix: VARIANT_PREFIX,
  })
  const [data, setData] = useState<{
    products: AdminProduct[]
    variants: AdminProductVariant[]
  }>()
  const { data: variantList, isLoading: isVariantLoading } = useQuery({
    queryFn: () =>
      sdk.admin.productVariant.list({
        id: data?.variants.map((x) => x.id),
        ...searchParams,
      }),
    queryKey: [
      "variants",
      data?.variants,
      searchParams.q,
      searchParams.limit,
      searchParams.offset,
      searchParams.created_at,
      searchParams.updated_at,
      searchParams.order,
    ],
    refetchOnMount: "always",
  })

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchWishlists(customer.id)

      setData(result)
    }
    fetchData()
  }, [customer.id])

  const columns = useVariantColumns()
  const { table } = useDataTable({
    data: variantList?.variants ?? [],
    columns: columns,
    getRowId: (original) => original.id,
    count: variantList?.count ?? 0,
    pageSize: VARIANT_PAGE_SIZE,
    prefix: VARIANT_PREFIX,
    enablePagination: true,
  })
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Wishlist Items</Heading>
      </div>

      <_DataTable
        table={table}
        columns={columns}
        pageSize={VARIANT_PAGE_SIZE}
        count={variantList?.count}
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
        isLoading={isVariantLoading}
      />
    </Container>
  )
}

export type WishlistDetailTypes = {
  id?: string
  product_id: string
  customer_id: string
  region_id: string
}
const variantColumnHelper = createColumnHelper<HttpTypes.AdminProductVariant>()

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
