import { Table } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import VariantActions from "../GiftDenominationSection/variant-actions"
import { useMemo, useState } from "react"

const DenominationTable = ({
  variants,
  product,
}: {
  variants: any
  product: HttpTypes.AdminProduct
}) => {
  if (!variants) {
    return <div>No variants available</div>
  }

  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 5
  const pageCount = Math.ceil(variants.length / pageSize)
  const canNextPage = useMemo(
    () => currentPage < pageCount - 1,
    [currentPage, pageCount]
  )
  const canPreviousPage = useMemo(() => currentPage - 1 >= 0, [currentPage])

  const nextPage = () => {
    if (canNextPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage(currentPage - 1)
    }
  }

  const currentOrders = useMemo(() => {
    const offset = currentPage * pageSize
    const limit = Math.min(offset + pageSize, variants.length)

    return variants.slice(offset, limit)
  }, [currentPage, pageSize, variants])
  return (
    <div className="flex gap-1 flex-col">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Denomination</Table.HeaderCell>
            <Table.HeaderCell>In other currencies</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentOrders?.map((variant: HttpTypes.AdminProductVariant) => {
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
                <Table.Cell>{optionValueWithCurrency}</Table.Cell>
                <Table.Cell>{priceList}</Table.Cell>
                <Table.Cell className="text-right">
                  <VariantActions
                    productId={product.id}
                    variantId={variant.id}
                  />
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
      <Table.Pagination
        count={variants.length}
        pageSize={pageSize}
        pageIndex={currentPage}
        pageCount={variants.length}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        previousPage={previousPage}
        nextPage={nextPage}
      />
    </div>
  )
}

export default DenominationTable
