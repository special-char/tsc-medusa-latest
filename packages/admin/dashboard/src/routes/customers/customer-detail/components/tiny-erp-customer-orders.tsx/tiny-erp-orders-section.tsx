import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Copy } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { _DataTable } from "../../../../../components/table/data-table"
import { useTinyErpOrders, TinyErpOrder } from "../../hooks/useTinyErpOrders"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { TotalCell } from "../../../../../components/table/table-cells/order/total-cell"

// Types for Tiny ERP order (adjust as needed based on actual API response)
// type TinyErpOrder = { ... } // Now imported from useTinyErpOrders

type TinyErpOrdersSectionProps = {
  customer: HttpTypes.AdminCustomer
}

const PAGE_SIZE = 10

export const TinyErpOrdersSection = ({
  customer,
}: TinyErpOrdersSectionProps) => {
  const { data, isLoading } = useTinyErpOrders(customer?.email)

  console.dir({ data, email: customer?.email }, { depth: null })
  const columns = useColumns()
  const { table } = useDataTable({
    data: data?.orders ?? [],
    columns,
    enablePagination: true,
    pageSize: PAGE_SIZE,
  })

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Tiny ERP Orders</Heading>
      </div>
      {/* {error && <Text className="px-6 py-2 text-red-600">{error.message}</Text>} */}
      <_DataTable
        columns={columns}
        table={table}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        count={data?.orders?.length ?? 0}
        noRecords={{ message: "No Tiny ERP orders found" }}
      />
    </Container>
  )
}

const columnHelper = createColumnHelper<TinyErpOrder>()

const useColumns = () => {
  return [
    columnHelper.accessor("id", {
      header: "Order ID",
      cell: (info) => (
        <Copy content={info.getValue()} className="text-ui-fg">
          {info.getValue()}
        </Copy>
      ),
    }),
    columnHelper.accessor("numero", {
      header: "Order Number",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("cliente_nome", {
      header: "Customer Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("data_pedido", {
      header: "Created At",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("situacao", {
      header: "Status",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("url_rastreamento", {
      header: "Tracking",
      cell: (info) => {
        const value = info.getValue()
        return value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ui-fg-interactive"
          >
            Track
          </a>
        ) : null
      },
    }),
    columnHelper.accessor("total_pedido", {
      header: () => (
        <div className="flex h-full w-full items-center justify-end">
          <span className="truncate">Order Total</span>
        </div>
      ),
      cell: (info) => (
        <div className="flex h-full w-full items-center justify-end">
          <TotalCell currencyCode="BRL" total={Number(info.getValue())} />
        </div>
      ),
    }),
  ]
}
