import {
  Button,
  Container,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  Heading,
  Toaster,
  useDataTable,
} from "@medusajs/ui"
import { Link, useNavigate } from "react-router-dom"
import { AdminQuote, useQuotes } from "../../hooks/quotes"
import { useEffect, useState } from "react"
import { t } from "i18next"
import { QuoteStatusCell } from "../../components/quote/quote-status"
import { QuoteStatus } from "../../lib/quote-status-helper"

const StatusTitles: Record<string, string> = {
  accepted: "Accepted",
  rejected: "Rejected",
  pending: "Pending",
}

const columnHelper = createDataTableColumnHelper<AdminQuote>()

const columns = [
  columnHelper.accessor("draft_order.display_id", {
    header: "ID",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue, row }) => {
      const status = getValue()
      if (
        status === "accepted" &&
        `${(row.original as any)?.payment_status}` === "captured"
      ) {
        return <QuoteStatusCell status={"captured" as QuoteStatus} />
      } else {
        return <QuoteStatusCell status={status as QuoteStatus} />
      }
    },
  }),
  columnHelper.accessor("customer.email", {
    header: "Email",
  }),
  columnHelper.accessor("draft_order.customer.first_name", {
    header: "First Name",
  }),
  columnHelper.accessor("draft_order.customer.company_name", {
    header: "Company Name",
  }),
  columnHelper.accessor("draft_order.total", {
    header: "Total",
    cell: ({ getValue, row }) =>
      `${row.original.draft_order?.currency_code?.toUpperCase()} ${getValue()}`,
  }),
  columnHelper.accessor("created_at", {
    header: "Created At",
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
  }),
]
const PAGE_SIZE = 10

export const Quotes = () => {
  const navigate = useNavigate()
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: PAGE_SIZE,
    pageIndex: 0,
  })

  const {
    quotes = [],
    count,
    isPending,
    refetch, // Ensure refetch is available from the hook
  } = useQuotes({
    limit: PAGE_SIZE,
    offset: pagination.pageIndex * PAGE_SIZE,
    // fields: "+draft_order.total,*draft_order.customer",
    order: "-created_at",
  })

  // Trigger refetch when pagination changes
  useEffect(() => {
    refetch()
  }, [pagination, refetch])

  const table = useDataTable({
    columns,
    data: quotes,
    getRowId: (quote) => quote.id,
    rowCount: count,
    isLoading: isPending,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    onRowClick(event, row) {
      navigate(`/quote/${row.id}`)
    },
  })

  return (
    <>
      <Container className="flex flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Quotes</Heading>
          <Button size="small" variant="secondary" asChild>
            <Link to="create">{t("actions.create")}</Link>
          </Button>
        </div>
        <DataTable instance={table}>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable>
      </Container>
      <Toaster />
    </>
  )
}
