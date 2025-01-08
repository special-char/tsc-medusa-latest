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

const listHistory = async (id: string) => {
  try {
    const res = await sdk.admin.redemption.retrieve(id)
    return res.redemption
  } catch (error) {
    console.log(error)
  }
}

type Redemption = {
  id: string
  redemptionId: string
  vendorId: string
  amountSpent: number
  expirationDate: string
  whereDeducted: string
}

export function RedemptionDetail() {
  const [historyData, setHistoryData] = useState([])
  const PAGE_SIZE = 10

  const { state } = useLocation()

  const columnHelper = createColumnHelper<any>()

  const columns = [
    columnHelper.accessor("id", {
      header: "Id",
      cell: (info) => (
        <span className="overflow-hidden line-clamp-1">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("redemption_id_id", {
      header: "Redemption Id",
      cell: (info) => (
        <span className="overflow-hidden line-clamp-1">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("vendor_id", {
      header: "Vendor Id",
      cell: (info) => (
        <span className="overflow-hidden line-clamp-1">{info.getValue()}</span>
      ),
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

  //"01JGKFS5NAVVEBT9Z8PSEEZTK8" vId

  const table = useReactTable<any>({
    data: historyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  useEffect(() => {
    if (state?.id) {
      listHistory(state?.id).then((res) => setHistoryData(res.history))
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
