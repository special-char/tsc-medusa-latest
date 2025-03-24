import { Button, Container, Heading } from "@medusajs/ui"
import { Link } from "react-router-dom"
import { _DataTable } from "../../../components/table/data-table"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../../lib/client"
import { useDataTable } from "../../../hooks/use-data-table"
import { AMCProps } from "../types"

const columns = [
  {
    id: "title",
    header: "Title",
    accessorKey: "title",
    cell: (cell: any) => cell.getValue(),
  },
  {
    id: "sku",
    header: "SKU",
    accessorKey: "sku",
    cell: (cell: any) => cell.getValue(),
  },
  {
    id: "barcode",
    header: "Barcode",
    accessorKey: "barcode",
    cell: (cell: any) => cell.getValue(),
  },

  {
    id: "actions",
    header: "Actions",
    cell: (cell) => (
      <Button size="small" variant="secondary" asChild>
        <Link to={`/amc/edit/${cell.row.original.id}`}>Edit</Link>
      </Button>
    ),
  },
]

const AmcList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["amc"],
    queryFn: async () => {
      const response = await sdk.admin.amc.list()
      console.log("API Response:", response)
      return response
    },
  })

  const tableData = data?.data || []
  console.log("Table Data:", tableData)

  const { table } = useDataTable<AMCProps>({
    columns,
    data: tableData,
    enablePagination: true,
  })

  console.log("Table Rows:", table.getRowModel().rows)

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">AMC List</Heading>
        <div className="flex items-center justify-center gap-x-2">
          <Button size="small" variant="secondary" asChild>
            <Link to="create">Create</Link>
          </Button>
        </div>
      </div>
      <_DataTable
        table={table}
        columns={columns}
        count={tableData.length}
        search
        pagination
        isLoading={isLoading}
        navigateTo={(row) => `/amc/edit/${row.original.id}`}
        noRecords={{
          message: "No records found",
        }}
        pageSize={10}
      />
      {/* <Outlet /> */}
    </Container>
  )
}

export default AmcList
