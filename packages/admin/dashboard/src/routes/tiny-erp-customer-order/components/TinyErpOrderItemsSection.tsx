import { Container, Heading, Text } from "@medusajs/ui"
import { _DataTable } from "../../../components/table/data-table/data-table"
import { createColumnHelper } from "@tanstack/react-table"
import { useDataTable } from "../../../hooks/use-data-table"

export const TinyErpOrderItemsSection = ({ order }: { order: any }) => {
  const columnHelper = createColumnHelper<any>()
  const columns = [
    columnHelper.accessor("codigo", {
      header: "Code",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("descricao", {
      header: "Description",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("quantidade", {
      header: "Qty",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("unidade", {
      header: "Unit",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("valor_unitario", {
      header: "Unit Price",
      cell: (info) => `R$ ${info.getValue()}`,
    }),
  ]

  const items = order.itens.map((itemObj: any) => itemObj.item)
  const { table } = useDataTable({
    data: items,
    columns,
    enablePagination: true,
    pageSize: items.length || 10,
  })

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Items</Heading>
      </div>
      <div className="">
        <_DataTable
          columns={columns}
          table={table}
          pageSize={items.length || 10}
          isLoading={false}
          count={items.length}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 px-6 py-4 md:grid-cols-2">
        <Text>
          <b>Subtotal:</b> R$ {order.total_produtos}
        </Text>
        <Text>
          <b>Discount:</b> R$ {order.valor_desconto}
        </Text>
        <Text>
          <b>Freight:</b> R$ {order.valor_frete}
        </Text>
        <Text>
          <b>Total:</b> R$ {order.total_pedido}
        </Text>
      </div>
      {order.obs && (
        <div className="px-6 py-4">
          <Heading level="h3" className="mb-2">
            Notes:
          </Heading>
          <Text>{order.obs}</Text>
        </div>
      )}
    </Container>
  )
}
