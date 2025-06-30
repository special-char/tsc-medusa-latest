import { Container, Heading, StatusBadge, Text, Copy } from "@medusajs/ui"

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "aberto":
      return "grey"
    case "aprovado":
    case "preparando_envio":
      return "orange"
    case "faturado":
    case "pronto_envio":
    case "enviado":
      return "blue"
    case "entregue":
      return "green"
    case "nao_entregue":
    case "cancelado":
      return "red"
    default:
      return "blue"
  }
}

export const TinyErpOrderGeneralSection = ({ order }: { order: any }) => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-x-2">
          <Heading level="h1">Order ID: #{order.id}</Heading>
          <Copy content={order.id} className="text-ui-fg-muted" />
        </div>
        <StatusBadge color={getStatusColor(order.situacao)}>
          {order.situacao}
        </StatusBadge>
      </div>

      <div className="flex items-center gap-x-1 px-6 py-4">
        <Text size="small" className="text-ui-fg-subtle w-24">
          Order Number
        </Text>
        <Text size="small">{order.numero}</Text>
      </div>
      <div className="flex items-center gap-x-1 px-6 py-4">
        <Text size="small" className="text-ui-fg-subtle w-24">
          Created At
        </Text>
        <Text size="small">{order.data_pedido}</Text>
      </div>
      <div className="flex items-center gap-x-1 px-6 py-4">
        <Text size="small" className="text-ui-fg-subtle w-24">
          Invoiced At
        </Text>
        <Text size="small">{order.data_faturamento}</Text>
      </div>
    </Container>
  )
}
