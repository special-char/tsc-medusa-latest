import { AdminOrder } from "@medusajs/types"
import { Container, Copy, Heading, Text } from "@medusajs/ui"

const TinyErpOrderWidget = ({ order }: { order: AdminOrder }) => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Tiny Erp Order Info</Heading>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          Tiny Erp Order Id
        </Text>
        <div className="flex flex-col gap-y-2">
          <div className="grid grid-cols-[1fr_20px] items-start gap-x-2">
            <Text
              size="small"
              leading="compact"
              className="text-pretty break-all"
            >
              {order.metadata?.tiny_erp_order_id as string}
            </Text>

            <div className="flex justify-end">
              <Copy
                content={order.metadata?.tiny_erp_order_id as string}
                className="text-ui-fg-muted"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          Tiny Erp Order Number
        </Text>
        <div className="flex flex-col gap-y-2">
          <div className="grid grid-cols-[1fr_20px] items-start gap-x-2">
            <Text
              size="small"
              leading="compact"
              className="text-pretty break-all"
            >
              {order.metadata?.tiny_erp_order_number as string}
            </Text>

            <div className="flex justify-end">
              <Copy
                content={order.metadata?.tiny_erp_order_number as string}
                className="text-ui-fg-muted"
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default TinyErpOrderWidget
