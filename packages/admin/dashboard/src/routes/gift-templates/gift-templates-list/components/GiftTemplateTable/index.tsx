import { createColumnHelper, Table as TableType } from "@tanstack/react-table"
import CustomTable from "../../../../../components/common/CustomTable"

const columnHelper = createColumnHelper<any>()
const column = columnHelper.accessor("title", {})
const column1 = columnHelper.display({
  id: "actions",
  cell: (info) => {},
})

export type Column = typeof column & typeof column1

interface Props {
  data: any[]
  PAGE_SIZE: number
  heading: string
  table: TableType<any>
}

const GiftTable = ({ data, PAGE_SIZE, heading, table }: Props) => {
  return (
    <CustomTable
      PAGE_SIZE={PAGE_SIZE}
      data={data}
      table={table}
      // columns={columns}
      // heading={heading}
    />
  )
}

export default GiftTable
