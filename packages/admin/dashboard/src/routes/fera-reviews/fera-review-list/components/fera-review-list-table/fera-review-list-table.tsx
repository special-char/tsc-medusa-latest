import { Container, Heading, StatusBadge } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import { _DataTable } from "../../../../../components/table/data-table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"

import { createColumnHelper } from "@tanstack/react-table"
import {
  DateCell,
  DateHeader,
} from "../../../../../components/table/table-cells/common/date-cell"
import { useFeraReviewTableQuery } from "../../../hooks/useFeraReviewTableQuery"
import { useFeraReviewTableFilter } from "../../../hooks/useFeraReviewTableFilter"
import { useFeraReviews } from "../../../hooks/useFeraReviews"
import { FeraReview } from "../../../types"
import { Link } from "react-router-dom"

const PAGE_SIZE = 10

export const FeraReviewListTable = () => {
  const { t } = useTranslation()
  const { searchParams, raw } = useFeraReviewTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { data, meta, isError, error, isLoading } = useFeraReviews(
    {
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const filters = useFeraReviewTableFilter()

  const columnHelper = createColumnHelper<FeraReview>()
  const columns = [
    columnHelper.accessor("id", {
      header: "id",
      cell: ({ getValue }) => {
        const id = getValue()

        return (
          <div className="text-ui-fg-interactive txt-compact-small flex h-full w-full items-center overflow-hidden">
            <span className="truncate">{id}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor("external_product_id", {
      header: "Medusa Product Id",
      cell: ({ getValue }) => {
        const external_product_id = getValue()

        if (external_product_id) {
          return (
            <Link
              to={`/products/${external_product_id}`}
              className="text-ui-fg-interactive txt-compact-small flex h-full w-full items-center overflow-hidden"
            >
              <span className="truncate">{external_product_id}</span>
            </Link>
          )
        } else {
          return <span>-</span>
        }
      },
    }),
    columnHelper.accessor("heading", {
      header: "Heading",
      cell: ({ getValue }) => {
        const heading = getValue()

        return <span className="truncate">{heading}</span>
      },
    }),
    columnHelper.accessor("state", {
      header: "Status",
      cell: ({ row }) => {
        let color = "grey"
        let status = "N/A"

        switch (row.original.state || "") {
          case "approved":
            color = "green"
            status = "Approved"
            break
          case "pending":
          case "pending_approval":
          case "pending_update":
            color = "blue"
            status = "Pending"
            break
          case "declined_approval":
            color = "orange"
            status = "Declined"
            break
          default:
            break
        }

        return <StatusBadge color={color as any}>{status}</StatusBadge>
      },
    }),
    columnHelper.accessor("rating", {
      header: "Rating",
      cell: ({ getValue }) => {
        const rating = getValue()

        return (
          <div className="flex items-center gap-2">
            {Array.from({ length: rating }).map((_, index) => (
              <span key={index}>X</span>
            ))}
          </div>
        )
      },
    }),
    columnHelper.accessor("created_at", {
      header: () => <DateHeader />,
      cell: ({ getValue }) => {
        const date = new Date(getValue()!)

        return <DateCell date={date} />
      },
    }),
  ]

  const { table } = useDataTable({
    data: data ?? [],
    columns,
    enablePagination: true,
    count: meta?.total_count,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>Fera Reviews</Heading>
      </div>
      <_DataTable
        columns={columns}
        table={table}
        pagination
        navigateTo={(row) => `/reviews/${row.original.id}`}
        filters={filters}
        count={meta?.total_count}
        search
        isLoading={isLoading}
        pageSize={PAGE_SIZE}
        // orderBy={[
        //   // { key: "display_id", label: t("orders.fields.displayId") },
        //   { key: "created_at", label: t("fields.createdAt") },
        //   { key: "updated_at", label: t("fields.updatedAt") },
        // ]}
        queryObject={raw}
        noRecords={{
          message: t("orders.list.noRecordsMessage"),
        }}
      />
    </Container>
  )
}
