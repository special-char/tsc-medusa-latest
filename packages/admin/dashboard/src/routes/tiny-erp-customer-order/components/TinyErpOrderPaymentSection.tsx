import { Container, Heading, StatusBadge, Text, Table } from "@medusajs/ui"

export const TinyErpOrderPaymentSection = ({ order }: { order: any }) => {
  function getStatusColor(paymentMethod: string) {
    switch (paymentMethod?.toLowerCase()) {
      case "multiplas":
        return "blue"
      case "dinheiro":
        return "green"
      case "credito":
        return "orange"
      case "cheque":
        return "grey"
      case "crediario":
        return "grey"
      case "duplicata_mercantil":
        return "grey"
      default:
        return "blue"
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Payment</Heading>
        <StatusBadge color={getStatusColor(order.forma_pagamento)}>
          {order.forma_pagamento}
        </StatusBadge>
      </div>
      <div className="grid grid-cols-1 gap-4 px-6 py-4 md:grid-cols-2">
        <Text>
          <b>Payment Terms:</b> {order.condicao_pagamento}
        </Text>
        <Text>
          <b>Payment Channel:</b> {order.meio_pagamento}
        </Text>
      </div>
      <div>
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Installments</Heading>
        </div>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Due Date</Table.HeaderCell>
              <Table.HeaderCell>Days</Table.HeaderCell>
              <Table.HeaderCell>Value</Table.HeaderCell>
              <Table.HeaderCell>Obs</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {order.parcelas.map((p: any, idx: number) => (
              <Table.Row key={idx}>
                <Table.Cell>{p.parcela.data}</Table.Cell>
                <Table.Cell>{p.parcela.dias}</Table.Cell>
                <Table.Cell>R$ {p.parcela.valor}</Table.Cell>
                <Table.Cell>{p.parcela.obs}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </Container>
  )
}
