import { Button, Container, Heading, Prompt } from "@medusajs/ui"
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
import QRCode from "react-qr-code"

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
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
        <span className="line-clamp-1 overflow-hidden">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("handle", {
      header: "Handle",
      cell: (info) => (
        <span className="line-clamp-1 overflow-hidden">{info.getValue()}</span>
      ),
    }),
    columnHelper.display({
      header: "Action",
      id: "action",
      cell: (info) => {
        return (
          <div className="flex w-[100px] gap-5">
            <Prompt>
              <Prompt.Trigger asChild>
                <Button variant="secondary">View QR</Button>
              </Prompt.Trigger>
              <Prompt.Content className="">
                <Prompt.Header>
                  <Prompt.Title>Scan QR</Prompt.Title>
                  <Prompt.Description>
                    Scan this QR to redeem your gift card.
                  </Prompt.Description>
                  <Prompt.Footer className="flex flex-col gap-4">
                    <QRCode
                      className="bg-white p-5"
                      value={info.row.original.id}
                      size={200}
                    />
                    <Prompt.Cancel className="self-end">Cancel</Prompt.Cancel>
                  </Prompt.Footer>
                </Prompt.Header>
              </Prompt.Content>
            </Prompt>
          </div>
        )
      },
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

  return (
    <Container>
      <div className="flex items-center justify-between">
        <Heading>Merchant list</Heading>
        <Button
          variant="primary"
          onClick={() => {
            navigate(`/merchants/create`)
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
