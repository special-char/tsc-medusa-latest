import { Button, Container, Heading } from "@medusajs/ui"
import { Outlet, useNavigate } from "react-router-dom"
import CustomTable from "../../../components/common/CustomTable"
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

type Order = {
  id: string
  displayId: number
  customer: string
  email: string
  amount: number
  currency: string
}

const fakeData: Order[] = [
  {
    id: "order_6782",
    displayId: 86078,
    customer: "Jill Miller",
    email: "32690@gmail.com",
    amount: 493,
    currency: "EUR",
  },
  {
    id: "order_46487",
    displayId: 42845,
    customer: "Sarah Garcia",
    email: "86379@gmail.com",
    amount: 113,
    currency: "JPY",
  },
  {
    id: "order_8169",
    displayId: 39129,
    customer: "Josef Smith",
    email: "89383@gmail.com",
    amount: 43,
    currency: "USD",
  },
  {
    id: "order_67883",
    displayId: 5548,
    customer: "Elvis Jones",
    email: "52860@gmail.com",
    amount: 840,
    currency: "GBP",
  },
  {
    id: "order_61121",
    displayId: 87668,
    customer: "Charles Rodriguez",
    email: "45675@gmail.com",
    amount: 304,
    currency: "GBP",
  },
]

export function VendorList() {
  const navigate = useNavigate()
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
    columnHelper.accessor("displayId", {
      header: "displayId",
      cell: (info) => (
        <span className="w-[200px] overflow-hidden line-clamp-1">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("customer", {
      header: "customer",
      cell: (info) => (
        <span className="w-[200px] overflow-hidden line-clamp-1">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("email", {
      header: "email",
      cell: (info) => (
        <span className="w-[200px] overflow-hidden line-clamp-1">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("amount", {
      header: "amount",
      cell: (info) => (
        <span className="w-[200px] overflow-hidden line-clamp-1">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("currency", {
      header: "currency",
      cell: (info) => (
        <span className="w-[200px] overflow-hidden line-clamp-1">
          {info.getValue()}
        </span>
      ),
    }),
  ]

  const table = useReactTable<any>({
    data: fakeData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

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
        <CustomTable PAGE_SIZE={PAGE_SIZE} data={fakeData} table={table} />
      </div>
      <Outlet />
    </Container>
  )
}
