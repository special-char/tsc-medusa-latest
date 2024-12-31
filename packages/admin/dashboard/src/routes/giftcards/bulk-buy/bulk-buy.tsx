import { Button, Container, Heading } from "@medusajs/ui"
import { Link, Outlet } from "react-router-dom"
import { DataTable } from "../../../components/table/data-table"
import { useOrderTableQuery } from "../../../hooks/table/query"
import { useOrders } from "../../../hooks/api"
import { DEFAULT_FIELDS } from "../../orders/order-list/const"
import { keepPreviousData } from "@tanstack/react-query"
import { useOrderTableFilters } from "../../../hooks/table/filters"
import { useOrderTableColumns } from "../../../hooks/table/columns"
import { useDataTable } from "../../../hooks/use-data-table"
import { useTranslation } from "react-i18next"
const PAGE_SIZE = 20
export const Bulkbuy = () => {
  const { t } = useTranslation()
  const { searchParams, raw } = useOrderTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { orders, count, isError, error, isLoading } = useOrders(
    {
      status: "draft",
      fields: DEFAULT_FIELDS,
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )
  // console.log(orders, "orders")

  const filters = useOrderTableFilters()
  const columns = useOrderTableColumns({})

  const { table } = useDataTable({
    data: orders ?? [],
    columns,
    enablePagination: true,
    count,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }
  return (
    <div className="flex flex-col gap-4 p-0">
      {/* <Container className="flex justify-between gap-6 p-8">
        <Heading level="h2" className="font-bold">
          Are you ready to Buy Bulk Gift Cards?
        </Heading>
        <Button size="small" variant="secondary" asChild>
          <Link to="import">Import</Link>
        </Button>

        <Outlet />
      </Container> */}
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading>Bulk Orders</Heading>
          <Button size="small" variant="secondary" asChild>
            <Link to="import">Import</Link>
          </Button>
          <Outlet />
        </div>
        <DataTable
          columns={columns}
          table={table}
          pagination
          navigateTo={(row) => `/orders/${row.original.id}`}
          filters={filters}
          count={count}
          search
          isLoading={isLoading}
          pageSize={PAGE_SIZE}
          orderBy={[
            { key: "display_id", label: t("orders.fields.displayId") },
            { key: "created_at", label: t("fields.createdAt") },
            { key: "updated_at", label: t("fields.updatedAt") },
          ]}
          queryObject={raw}
          noRecords={{
            message: t("orders.list.noRecordsMessage"),
          }}
        />
      </Container>
    </div>
  )
}
