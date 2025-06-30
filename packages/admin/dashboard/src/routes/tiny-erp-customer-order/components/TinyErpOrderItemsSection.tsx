import { Container, Heading, Text } from "@medusajs/ui"
import { _DataTable } from "../../../components/table/data-table/data-table"
import { createColumnHelper } from "@tanstack/react-table"
import { useDataTable } from "../../../hooks/use-data-table"
import { TotalCell } from "../../../components/table/table-cells/order/total-cell"

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
      header: () => (
        <div className="flex h-full w-full items-center justify-end">
          <span className="truncate">Unit Price</span>
        </div>
      ),
      cell: (info) => (
        <TotalCell currencyCode="BRL" total={Number(info.getValue())} />
      ),
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
    <>
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
      </Container>
      <Container className="divide-y p-0">
        <div className="flex items-center gap-x-1 px-6 py-4">
          <Text size="small" className="text-ui-fg-subtle w-24">
            Subtotal
          </Text>
          <TotalCell
            currencyCode="BRL"
            total={Number(order.total_produtos)}
            align="left"
          />
        </div>
        <div className="flex items-center gap-x-1 px-6 py-4">
          <Text size="small" className="text-ui-fg-subtle w-24">
            Discount
          </Text>
          <TotalCell
            currencyCode="BRL"
            total={Number(order.valor_desconto)}
            align="left"
          />
        </div>
        <div className="flex items-center gap-x-1 px-6 py-4">
          <Text size="small" className="text-ui-fg-subtle w-24">
            Freight
          </Text>
          <TotalCell
            currencyCode="BRL"
            total={Number(order.valor_frete)}
            align="left"
          />
        </div>
        <div className="flex items-center gap-x-1 px-6 py-4">
          <Text size="small" className="text-ui-fg-subtle w-24">
            Total
          </Text>
          <TotalCell
            currencyCode="BRL"
            total={Number(order.total_pedido)}
            align="left"
          />
        </div>
        {order.obs && (
          <div className="px-6 py-4">
            <Heading level="h3" className="mb-2">
              Notes:
            </Heading>
            <Text className="text-ui-fg-subtle">{order.obs}</Text>
          </div>
        )}
      </Container>
    </>
  )
}
