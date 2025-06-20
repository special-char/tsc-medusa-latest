import { Container, Heading, Text, Copy } from "@medusajs/ui"

export const TinyErpOrderCustomerSection = ({
  customer,
  customerId,
}: {
  customer: any
  customerId?: string
}) => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Customer</Heading>
      </div>
      <div className="divide-y">
        <div className="px-6 py-4 text-base font-semibold">{customer.nome}</div>
        <div className="flex items-center gap-x-1 px-6 py-4">
          <Text size="small" className="text-ui-fg-subtle w-24">
            CPF/CNPJ
          </Text>
          <Text size="small">{customer.cpf_cnpj}</Text>
          <Copy content={customer.cpf_cnpj} className="text-ui-fg-muted" />
        </div>
        <div className="flex items-center gap-x-1 px-6 py-4">
          <Text size="small" className="text-ui-fg-subtle w-24">
            Phone
          </Text>
          <Text size="small">{customer.fone}</Text>
          <Copy content={customer.fone} className="text-ui-fg-muted" />
        </div>
        <div className="px-6 py-4">
          <Text size="small" className="text-ui-fg-subtle">
            Address
          </Text>
          <div className="text-sm">
            {customer.endereco}, {customer.numero} {customer.complemento},<br />
            {customer.bairro}, {customer.cidade} - {customer.uf}, {customer.cep}
          </div>
        </div>
      </div>
    </Container>
  )
}
