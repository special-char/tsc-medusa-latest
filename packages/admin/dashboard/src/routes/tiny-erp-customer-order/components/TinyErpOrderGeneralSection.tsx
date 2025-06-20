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
      <div className="grid grid-cols-1 gap-4 px-6 py-4 md:grid-cols-2">
        <Text>
          <b>Order Number:</b> {order.numero}
        </Text>
        <Text>
          <b>Created At:</b> {order.data_pedido}
        </Text>
        <Text>
          <b>Expected Date:</b> {order.data_prevista}
        </Text>
        <Text>
          <b>Invoiced At:</b> {order.data_faturamento}
        </Text>
        <Text>
          <b>Tracking:</b>{" "}
          {order.url_rastreamento ? (
            <a
              href={order.url_rastreamento}
              target="_blank"
              rel="noopener noreferrer"
            >
              {order.codigo_rastreamento}
            </a>
          ) : (
            "N/A"
          )}
        </Text>
      </div>
    </Container>
  )
}
