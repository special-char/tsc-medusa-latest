import { Container, Heading, Tooltip } from "@medusajs/ui"
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import CustomTable from "../../../components/common/CustomTable"
import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { sdk } from "../../../lib/client"
import { useProduct } from "../../../hooks/api"
import { format } from "date-fns"

const listHistory = async () => {
  try {
    const res = await sdk.admin.redemption.retrieveHistories()
    return res.histories
  } catch (error) {
    console.log(error)
  }
}

const listVendors = async () => {
  const response = await sdk.vendor.retrieve()
  return response
}

export function RedemptionDetail() {
  const [historyData, setHistoryData] = useState([])
  const [vendor, setVendor] = useState<any>([])
  const PAGE_SIZE = 10

  const { state } = useLocation()

  const columnHelper = createColumnHelper<any>()

  const columns = [
    columnHelper.accessor("product_id", {
      header: "Product Title",
      cell: (info) => {
        const { product } = useProduct(
          info.row.original.redemption_id.product_id
        )

        return (
          <span className="line-clamp-1 w-[80px] overflow-hidden">
            <a
              href={`/products/${info.row.original.redemption_id.product_id}`}
              className="text-blue-500 underline"
            >
              {product?.title}
            </a>
          </span>
        )
      },
    }),
    columnHelper.accessor("order_id", {
      header: "Order Id",
      cell: (info) => {
        return (
          <Tooltip
            maxWidth={260}
            content={info.row.original.redemption_id.product_id}
          >
            <span className="line-clamp-1 w-[90px] overflow-hidden">
              <a
                href={`/orders/${info.row.original.redemption_id.product_id}`}
                className="text-blue-500 underline"
              >
                {info.row.original.redemption_id.product_id.slice(-7)}
              </a>
            </span>
          </Tooltip>
        )
      },
    }),
    columnHelper.accessor("gift_code", {
      header: "Gift Code",
      cell: (info) => {
        return (
          <span className="line-clamp-1 w-[150px] overflow-hidden">
            {info.row.original.redemption_id.gift_card_code}
          </span>
        )
      },
    }),
    columnHelper.accessor("vendor_id", {
      header: "Vendor Name",
      cell: (info) => {
        const vendorName = vendor.find(
          (x: any) => x?.id === info.row.original.vendor_id
        )?.name

        return (
          <span className="line-clamp-1 w-[100px] overflow-hidden">
            {vendorName}
          </span>
        )
      },
    }),
    columnHelper.accessor("amount_spent", {
      header: "Amount Spent",
      cell: (info) => (
        <span className="line-clamp-1 w-[90px] overflow-hidden">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => (
        <span className="line-clamp-1 w-[90px] overflow-hidden">
          {info.row.original.redemption_id.amount}
        </span>
      ),
    }),
    columnHelper.accessor("amount_remaining", {
      header: "Balance",
      cell: (info) => (
        <span className="line-clamp-1 w-[90px] overflow-hidden">
          {info.row.original.amount_remaining}
        </span>
      ),
    }),
    columnHelper.accessor("where_deducted", {
      header: "Where Deducted",
      cell: (info) => (
        <span className="line-clamp-1 w-[100px] overflow-hidden">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("created_at", {
      header: "Used On",
      cell: (info) => (
        <span className="line-clamp-1 w-[200px] overflow-hidden">
          {format(info.getValue(), "dd/MM/yyy hh:mm:ss")}
        </span>
      ),
    }),
  ]

  const table = useReactTable<any>({
    data: historyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  useEffect(() => {
    listHistory().then((res) => setHistoryData(res))
    listVendors().then((res) => setVendor(res.data))
  }, [])

  return (
    <Container>
      <Heading>Redemptions</Heading>
      <div className="my-4">
        {historyData && (
          <CustomTable PAGE_SIZE={PAGE_SIZE} data={historyData} table={table} />
        )}
      </div>
    </Container>
  )
}
