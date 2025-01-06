import { Button, Container, Heading } from "@medusajs/ui"
import { Outlet, useNavigate } from "react-router-dom"
import CustomTable from "../../../components/common/CustomTable"
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { sdk } from "../../../lib/client"
import { useEffect, useState } from "react"

const listVendors = async () => {
  const response = await sdk.vendor.retrieve()
  return response
}

export function VendorList() {
  const [vendorList, setVendorList] = useState([])

  const navigate = useNavigate()

  const PAGE_SIZE = 10

  const columnHelper = createColumnHelper<any>()

  const columns = [
    columnHelper.accessor("id", {
      header: "Id",
      cell: (info) => (
        <span className="line-clamp-1 w-[200px] overflow-hidden">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
        <span className="line-clamp-1 w-[200px] overflow-hidden">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("handle", {
      header: "Handle",
      cell: (info) => (
        <span className="line-clamp-1 w-[200px] overflow-hidden">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("logo", {
      header: "Logo",
      cell: (info) => (
        <span className="line-clamp-1 w-[200px] overflow-hidden">
          {info.getValue()}
        </span>
      ),
    }),
  ]

  const table = useReactTable<any>({
    data: vendorList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  useEffect(() => {
    listVendors().then((res) => {
      setVendorList(res.data)
    })
  }, [])

  console.log("vendorList", vendorList)

  return (
    <Container>
      <div className="flex items-center justify-between">
        <Heading>Vendor list</Heading>
        <Button
          variant="primary"
          onClick={() => {
            navigate(`/vendors/create`)
          }}
        >
          Create
        </Button>
      </div>
      <div className="my-4">
        <CustomTable PAGE_SIZE={PAGE_SIZE} data={vendorList} table={table} />
      </div>
      <Outlet />
    </Container>
  )
}
