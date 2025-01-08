import { Container, Heading } from "@medusajs/ui"
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

const listHistory = async (id: string) => {
  try {
    const res = await sdk.admin.redemption.retrieve(id)
    return res.redemption
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
        const { product } = useProduct(state.product_id)

        return (
          <span className="overflow-hidden line-clamp-1">
            <a
              href={`/products/${info.row.original.product_id}`}
              className="underline text-blue-500"
            >
              {product?.title}
            </a>
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
          <span className="w-[250px] overflow-hidden line-clamp-1">
            {vendorName}
          </span>
        )
      },
    }),
    columnHelper.accessor("amount_spent", {
      header: "Amount Spent",
      cell: (info) => (
        <span className="overflow-hidden line-clamp-1">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("where_deducted", {
      header: "Where Deducted",
      cell: (info) => (
        <span className="w-[150px] overflow-hidden line-clamp-1">
          {info.getValue()}
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
    if (state?.id) {
      listHistory(state?.id).then((res) => setHistoryData(res.history))
      listVendors().then((res) => setVendor(res.data))
    }
  }, [])

  return (
    <Container>
      <Heading>History</Heading>
      <div className="my-4">
        {historyData && (
          <CustomTable PAGE_SIZE={PAGE_SIZE} data={historyData} table={table} />
        )}
      </div>
    </Container>
  )
}
