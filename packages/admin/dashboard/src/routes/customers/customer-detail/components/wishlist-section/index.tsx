import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"

import { PencilSquare } from "@medusajs/icons"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu/index.ts"
import { useDataTable } from "../../../../../hooks/use-data-table.tsx"
import { DataTable } from "../../../../../components/table/data-table/data-table.tsx"

type CustomerGroupSectionProps = {
  customer: HttpTypes.AdminCustomer
}

const PAGE_SIZE = 10
const PREFIX = "cusgr"

const fetchWishlists = async (customerId: string) => {
  try {
    const res = await fetch(
      `${__BACKEND_URL__}/admin/wishlist/customer/${customerId}`,
      {
        credentials: "include",
        // headers: {
        // "x-publishable-api-key":
        //   "pk_60e40a6ab188f40d04717c08a86d30696524a80f64f8e71b51e72056b0e4265c",
        // "x-publishable-api-key": __PUBLISHABLE_KEY__,
        // },
      }
    )
    if (!res.ok) {
      throw new Error(res)
    }
    const response = await res.json()

    return response
  } catch (error) {
    console.log("fetchWishlists", error)
  }
}

export const WishlistSection = ({ customer }: CustomerGroupSectionProps) => {
  const [data, setData] = useState({
    wishlist: [],
    products: [],
  })
  const { wishlist, products: wishlists } = data
  useEffect(() => {
    fetchWishlists(customer.id).then((data) => setData(data))
  }, [customer.id])

  const columns = useColumns()

  const { table } = useDataTable<HttpTypes.StoreProduct>({
    data: wishlists ?? [],
    columns,
    enablePagination: true,
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Wishlist Items</Heading>
      </div>
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        isLoading={!wishlists}
        count={wishlists?.length ?? 0}
        prefix={PREFIX}
        navigateTo={(row) => `/products/${row.original.id}`}
        // pagination
        noRecords={{
          message: "No wishlist items found",
        }}
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
const columnHelper = createColumnHelper<HttpTypes.StoreProduct>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("thumbnail", {
        header: "Thumbnail",
        cell: (info) => {
          return (
            <div className="my-2">
              <img
                src={info.getValue()}
                className="aspect-square h-24 rounded-md"
              />
            </div>
          )
        },
      }),
      // columnHelper.accessor("id", {
      //   header: "ID",
      //   cell: (info) => (
      //     <Link to={`/products/${info.getValue()}`} className="text-blue-500">
      //       {info.getValue()}
      //     </Link>
      //   ),
      // }),
      columnHelper.accessor("title", {
        header: "Title",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("handle", {
        header: "Handle",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return (
            <ActionMenu
              groups={[
                {
                  actions: [
                    {
                      label: "View Product",
                      to: `/products/${row.original.id}`,
                      icon: <PencilSquare />,
                    },
                  ],
                },
              ]}
            />
          )
        },
      }),
    ],
    [t]
  )
}
