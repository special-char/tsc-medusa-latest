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

const listRedemptions = async () => {
  try {
    const response = await fetch(`${__BACKEND_URL__}/admin/redemption`, {
      credentials: "include",
    })
    const res = await response.json()

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
    columnHelper.accessor("id", {
      header: "Id",
      cell: (info) => (
        <span className="w-[200px] overflow-hidden line-clamp-1">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("gift_card_code", {
      header: "Gift Card Code",
      cell: (info) => (
        <span className="w-[200px] overflow-hidden line-clamp-1">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => (
        <span className="w-[200px] overflow-hidden line-clamp-1">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("balance", {
      header: "Balance",
      cell: (info) => (
        <span className="w-[200px] overflow-hidden line-clamp-1">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("expiration_date", {
      header: "Expiration Date",
      cell: (info) => (
        <span className="w-[200px] overflow-hidden line-clamp-1">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      header: "Actions",
      id: "actions",
      cell: (info) => {
        return (
          <div className="flex w-[200px] gap-5">
            <button
              className="border rounded-md py-1 px-2"
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
