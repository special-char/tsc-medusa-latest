import { Table } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import VariantActions from "../GiftDenominationSection/variant-actions"

const DenominationTable = ({
  variants,
  product,
}: {
  variants: any
  product: HttpTypes.AdminProduct
}) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          {/* <Table.HeaderCell>Title</Table.HeaderCell> */}
          <Table.HeaderCell>Denomination</Table.HeaderCell>
          <Table.HeaderCell>In other currencies</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {variants?.map((variant: HttpTypes.AdminProductVariant) => {
          const optionValue = variant?.options?.[0]?.value
          const filteredPrices = variant?.prices?.filter((price) => {
            return !(
              price.amount.toString() === optionValue &&
              price.currency_code ===
                variant?.prices?.find(
                  (p) => p.amount.toString() === optionValue
                )?.currency_code
            )
          })
          const priceList =
            filteredPrices
              ?.map((price) => `${price.amount} ${price.currency_code}`)
              .join(", ") || "-"

          const optionValueWithCurrency = `${optionValue} ${variant?.prices?.find((price) => price.amount.toString() === optionValue)?.currency_code || ""}`

          return (
            <Table.Row
              key={variant.id}
              className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap te"
            >
              {/* <Table.Cell>{variant.title}</Table.Cell> */}
              <Table.Cell>{optionValueWithCurrency}</Table.Cell>
              <Table.Cell>{priceList}</Table.Cell>
              <Table.Cell className="text-right">
                <VariantActions productId={product.id} variantId={variant.id} />
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default DenominationTable
