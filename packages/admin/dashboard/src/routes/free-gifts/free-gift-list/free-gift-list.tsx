import {
  createDataTableColumnHelper,
  useDataTable,
  // DataTable,
  Heading,
  DataTablePaginationState,
  Container,
  Button,
  DataTable,
} from "@medusajs/ui"
import { PlusMini } from "@medusajs/icons"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router-dom"
import { FreeProductsDTO } from "../type"
import FreeGiftActions from "../components/FreeGiftActions"
import { sdk } from "../../../lib/client"

const columnHelper = createDataTableColumnHelper<FreeProductsDTO>()

const columns = [
  columnHelper.accessor("id", {
    header: "id",
  }),
  columnHelper.accessor("variant_id", {
    header: "Variant",
    cell: ({ row }) => (
      <Link
        to={`/products/${row.original.product_id}/variants/${row.original.variant_id}`}
        className="text-ui-fg-interactive hover:underline"
      >
        {row.original.product_variant?.title}
      </Link>
    ),
  }),
  columnHelper.accessor("product_variant.product.title", {
    header: "Product",
    cell: ({ row }) => (
      <Link
        to={`/products/${row.original.product_id}`}
        className="text-ui-fg-interactive hover:underline"
      >
        {row.original.product_variant?.product?.title || "N/A"}
      </Link>
    ),
  }),
  columnHelper.accessor("min_price", {
    header: "Cart Min Price",
  }),
  columnHelper.accessor("max_price", {
    header: "Cart Max Price",
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      return <FreeGiftActions data={row.original} />
    },
  }),
]

const PAGE_SIZE = 10

const fetchFreeProducts = async ({
  limit = 10,
  page = 1,
}: {
  limit: number
  page: number
}) => {
  // TODO: need to change this to the correct url if needed
  const res = await sdk.client.fetch(
    `/admin/free-product?limit=${limit}&page=${Math.max(page, 1)}`,
    {
      credentials: "include",
    }
  )

  return res as any
}

export function FreeGiftList() {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: PAGE_SIZE,
    pageIndex: 0,
  })

  const navigate = useNavigate()

  const {
    data: freeProducts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["free-products-list", pagination.pageIndex],
    queryFn: async () =>
      await fetchFreeProducts({
        limit: PAGE_SIZE,
        page: pagination.pageIndex + 1,
      }),
  })

  console.log({ freeProducts })

  const table = useDataTable({
    columns,
    data: freeProducts?.freeProducts || [],
    getRowId: (data) => data.id,
    rowCount: freeProducts?.count || 0,
    isLoading: isLoading,
    pagination: {
      // Pass the pagination state and updater to the table instance
      state: pagination,
      onPaginationChange: (newPagination) => setPagination(newPagination), // Ensure the new pagination state is set
    },
  })

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  const handleCreateModel = () => {
    navigate("create")
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>Free Products</Heading>
        <Button className="flex items-center gap-2" onClick={handleCreateModel}>
          <PlusMini />
          <span>Create</span>
        </Button>
      </div>
      {freeProducts?.count === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-ui-fg-subtle text-sm">No any free Gift found.</p>
        </div>
      ) : (
        <DataTable instance={table}>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable>
      )}
    </Container>
  )
}
