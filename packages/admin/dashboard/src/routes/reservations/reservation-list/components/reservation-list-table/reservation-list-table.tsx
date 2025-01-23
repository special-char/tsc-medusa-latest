import { Button, Container, Heading, Text } from "@medusajs/ui"

import { DataTable } from "../../../../../components/table/data-table"
import { Link } from "react-router-dom"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useReservationItems } from "../../../../../hooks/api/reservations"
import { useReservationTableColumns } from "./use-reservation-table-columns"
import { useReservationTableFilters } from "./use-reservation-table-filters"
import { useReservationTableQuery } from "./use-reservation-table-query"
import { useTranslation } from "react-i18next"
import { getSalesChannelIds } from "../../../../../const/get-sales-channel"

const PAGE_SIZE = 20

export const ReservationListTable = () => {
  const { t } = useTranslation()

  const { searchParams } = useReservationTableQuery({
    pageSize: PAGE_SIZE,
  })
  const {
    reservations: allReservations,
    isPending,
    isError,
    error,
  } = useReservationItems({
    fields: "*inventory_item.variants.product.sales_channels",
    limit: Number.MAX_SAFE_INTEGER,
  })
  const salesChannelIds = getSalesChannelIds()
  const filters = useReservationTableFilters()
  const columns = useReservationTableColumns()

  const filteredReservations =
    salesChannelIds.length === 0
      ? allReservations
      : allReservations?.filter((item: any) =>
          item.inventory_item?.variants?.some((variant: any) =>
            variant.product.sales_channels.some((channel: any) =>
              salesChannelIds.includes(channel.id)
            )
          )
        )

  const filteredCount = filteredReservations?.length ?? 0

  // Get the paginated subset of filtered reservations
  const startIndex = searchParams.offset ?? 0
  const endIndex = startIndex + PAGE_SIZE
  const paginatedReservations = filteredReservations?.slice(
    startIndex,
    endIndex
  )

  const { table } = useDataTable({
    data: paginatedReservations ?? [],
    columns,
    count: filteredCount,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("reservations.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("reservations.subtitle")}
          </Text>
        </div>
        <Button variant="secondary" size="small" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={filteredCount}
        isLoading={isPending}
        filters={filters}
        pagination
        navigateTo={(row) => row.id}
        search={false}
      />
    </Container>
  )
}
