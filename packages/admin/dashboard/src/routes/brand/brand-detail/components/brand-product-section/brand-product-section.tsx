/* eslint-disable prettier/prettier */

import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { _DataTable } from "../../../../../components/table/data-table"
import { useProducts } from "../../../../../hooks/api/products"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { Brand } from "../../../brand-list/components/brand-list-table/brand-list-table"

type BrandProductSectionProps = {
  Brand: Brand
}

const PAGE_SIZE = 10

export const BrandProductSection = ({ Brand }: BrandProductSectionProps) => {
  const { t } = useTranslation()

  const { searchParams, raw } = useProductTableQuery({
    pageSize: PAGE_SIZE,
  })
  const productIds = Brand.products.map((product: any) => product.id)

  const { products, count, isPending, isError, error } = useProducts({
    ...searchParams,
    ...(productIds.length > 0 ? { id: productIds } : {}),
  })

  const filters = useProductTableFilters(["product_types"])
  const columns = useProductTableColumns()

  const { table } = useDataTable({
    columns,
    data: products,
    count: products?.length || 0,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">{t("products.domain")}</Heading>
      </div>
      <_DataTable
        table={table}
        filters={filters}
        isLoading={isPending}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        navigateTo={({ original }) => `/products/${original.id}`}
        orderBy={[
          { key: "title", label: t("fields.title") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        queryObject={raw}
        search
        pagination
      />
    </Container>
  )
}
