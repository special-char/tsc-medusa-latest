import { createDataTableColumnHelper } from "@medusajs/ui"
import { useMemo } from "react"
import { DataTable } from "../../../../components/data-table"

export interface ShippingChargeData {
  [key: string]: string
}

const columnHelper = createDataTableColumnHelper<ShippingChargeData>()

interface ShippingChargesTableProps {
  data: ShippingChargeData[]
  columns: string[]
  isLoading: boolean
}

export const ShippingChargesTable = ({
  data,
  columns: csvColumns,
  isLoading,
}: ShippingChargesTableProps) => {
  const columns = useMemo(() => {
    if (csvColumns.length === 0) {
      return []
    }

    return csvColumns.map((column) =>
      columnHelper.accessor(column, {
        header: column,
        cell: ({ row }) => {
          const value = row.original[column]
          return value || "-"
        },
        enableSorting: true,
      })
    )
  }, [csvColumns])

  if (data.length === 0 || columns.length === 0) {
    return null
  }

  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={(row) => {
        const index = data.indexOf(row)
        return `row-${index}`
      }}
      rowCount={data.length}
      enablePagination={false}
      heading={`Shipping Charges (${data.length} records)`}
      isLoading={isLoading}
      emptyState={{
        empty: {
          heading: "No shipping charges data",
          description: "Upload a CSV file to get started",
        },
        filtered: {
          heading: "No matching records",
          description: "Try adjusting your search or filters",
        },
      }}
    />
  )
} 