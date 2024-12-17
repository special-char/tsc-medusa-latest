import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useProductVariants } from "../../../../../../hooks/api/products"
import { useProductVariantTableQuery } from "../../../../../products/product-detail/components/product-variant-section/use-variant-table-query"

import DenominationTable from "../DenominationTabel.tsx"
import { Plus } from "@medusajs/icons"
import { Link } from "react-router-dom"

type ProductVariantSectionProps = {
  product: HttpTypes.AdminProduct
}

const PAGE_SIZE = 10

export const GiftDenominationSection = ({
  product,
}: ProductVariantSectionProps) => {
  const { searchParams } = useProductVariantTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { variants, isError, error } = useProductVariants(
    product.id,
    {
      ...searchParams,
      fields: "*inventory_items.inventory.location_levels,+inventory_quantity",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Denominations</Heading>
        <Link
          to={`/gift-cards/${product.id}/add-denomination`}
          className="gap-x-2 flex items-center border p-2 rounded-md text-xs"
        >
          <Plus />
          Add Denomination
        </Link>
      </div>
      <DenominationTable variants={variants} product={product} />
    </Container>
  )
}
