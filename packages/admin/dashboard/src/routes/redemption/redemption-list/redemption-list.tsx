import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import CustomTable from "../../../components/common/CustomTable"
import { Container, Heading } from "@medusajs/ui"
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { sdk } from "../../../lib/client"
import { useProduct } from "../../../hooks/api"

const listRedemptions = async () => {
  try {
    const res = await sdk.admin.redemption.retrieveAll()
    return res.redemptions
  } catch (error) {
    console.log(error)
  }
}

export function RedemptionList() {
  const navigate = useNavigate()

  const [redemptionData, setRedemptionData] = useState([])

  const PAGE_SIZE = 10

  const columnHelper = createColumnHelper<any>()

  const columns = [
    columnHelper.accessor("product_id", {
      header: "Product Title",
      cell: (info) => {
        const { product } = useProduct(info.row.original.product_id)

        return (
          <span className="line-clamp-1 overflow-hidden">
            <a
              href={`/products/${info.row.original.product_id}`}
              className="text-blue-500 underline"
            >
              {product?.title}
            </a>
          </span>
        )
      },
    }),
    columnHelper.accessor("gift_card_code", {
      header: "Gift Card Code",
      cell: (info) => (
        <span className="line-clamp-1 overflow-hidden">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => (
        <span className="line-clamp-1 w-[30px] overflow-hidden">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("balance", {
      header: "Balance",
      cell: (info) => (
        <span className="line-clamp-1 w-[30px] overflow-hidden">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("expiration_date", {
      header: "Expiration Date",
      cell: (info) => (
        <span className="line-clamp-1 w-[150px] overflow-hidden">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      header: "Actions",
      id: "actions",
      cell: (info) => {
        return (
          <div className="flex w-[100px] gap-5">
            <button
              className="rounded-md border px-2 py-1"
              onClick={() => {
                navigate(`/redemption/${info.row.original.id}`, {
                  state: info.row.original,
                })
              }}
            >
              See Details
            </button>
          </div>
        )
      },
    }),
  ]

  const table = useReactTable<any>({
    data: redemptionData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  useEffect(() => {
    listRedemptions().then((res) => setRedemptionData(res))
  }, [])

  return (
    <Container>
      <Heading>Redemption</Heading>
      <div className="my-4">
        <CustomTable
          PAGE_SIZE={PAGE_SIZE}
          data={redemptionData}
          table={table}
        />
      </div>
      <Outlet />
    </Container>
  )
}
