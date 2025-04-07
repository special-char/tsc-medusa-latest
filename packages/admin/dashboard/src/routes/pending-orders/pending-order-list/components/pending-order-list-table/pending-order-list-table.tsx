import { Button, Container, Heading, StatusBadge, toast } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import { _DataTable } from "../../../../../components/table/data-table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"

import { usePendingOrders } from "../../../hooks/usePendingOrders"
import { createColumnHelper } from "@tanstack/react-table"
import { BaseCart } from "@medusajs/types/dist/http/cart/common"
import { DisplayIdHeader } from "../../../../../components/table/table-cells/order/display-id-cell"
import {
  DateCell,
  DateHeader,
} from "../../../../../components/table/table-cells/common/date-cell"
import {
  CustomerCell,
  CustomerHeader,
} from "../../../../../components/table/table-cells/order/customer-cell"
import { CartDTO, HttpTypes } from "@medusajs/types"
import {
  PaymentStatusCell,
  PaymentStatusHeader,
} from "../../../../../components/table/table-cells/order/payment-status-cell"
import {
  TotalCell,
  TotalHeader,
} from "../../../../../components/table/table-cells/order/total-cell"
import { usePendingOrderTableQuery } from "../../../hooks/usePendingOrderTableQuery"
import { useSendNotificationPendingOrder } from "../../../hooks/useSendNotificationPendingOrder"
import { usePendingOrderTableFilters } from "../../../hooks/usePendingOrderTableFilter"

const PAGE_SIZE = 20

export const PendingOrderListTable = () => {
  const { t } = useTranslation()
  const { searchParams, raw } = usePendingOrderTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { carts, count, isError, error, isLoading } = usePendingOrders(
    {
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const filters = usePendingOrderTableFilters()

  const columnHelper = createColumnHelper<
    BaseCart & {
      customer: HttpTypes.AdminCustomer
    }
  >()
  const columns = [
    columnHelper.accessor("id", {
      header: () => <DisplayIdHeader />,
      cell: ({ getValue }) => {
        const id = getValue()

        return (
          <div className="text-ui-fg-subtle txt-compact-small flex h-full w-full items-center overflow-hidden">
            <span className="truncate">{id}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor("updated_at", {
      header: () => <DateHeader />,
      cell: ({ getValue }) => {
        const date = new Date(getValue()!)

        return <DateCell date={date} />
      },
    }),
    columnHelper.accessor("customer", {
      header: () => <CustomerHeader />,
      cell: ({ getValue }) => {
        const customer = getValue()

        return <CustomerCell customer={customer} />
      },
    }),
    columnHelper.accessor("payment_collection.status", {
      header: () => <PaymentStatusHeader />,
      cell: ({ getValue }) => {
        const status = getValue()

        return <PaymentStatusCell status={status} />
      },
    }),
    columnHelper.accessor("payment_collection", {
      header: () => <PaymentStatusHeader />,
      cell: ({ row }) => {
        let color = "grey"
        let paymentMethod = "N/A"
        switch (
          row.original.payment_collection?.payment_sessions?.[0]?.provider_id ||
          ""
        ) {
          case "pp_pagbank-boleto_pagbank":
            color = "blue"
            paymentMethod = "Boleto"
            break
          case "pp_pagbank-pix_pagbank":
            color = "orange"
            paymentMethod = "PIX"
            break
          case "pp_pagbank-cc_pagbank":
            color = "green"
            paymentMethod = "Credit Card"
            break
          default:
            break
        }

        return <StatusBadge color={color as any}>{paymentMethod}</StatusBadge>
      },
    }),
    columnHelper.accessor("total", {
      header: () => <TotalHeader />,
      cell: ({ getValue, row }) => {
        const total = getValue()
        const currencyCode = row.original.currency_code

        return <TotalCell currencyCode={currencyCode} total={total} />
      },
    }),
  ]

  const { table } = useDataTable({
    data: carts ?? [],
    columns,
    enablePagination: true,
    count,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  const { mutateAsync, isPending } = useSendNotificationPendingOrder({
    onSuccess: () => {
      toast.success("Email send successfully")
    },
    onError: (error) => {
      toast.error(error.message || "Email send failed")
    },
  })

  const handleEmailReminder = async () => {
    console.log("handled")

    await mutateAsync(
      carts.map((x: CartDTO) => ({ cart_id: x.id, email: x.email }))
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>Pending Orders</Heading>
        <Button
          disabled={isPending}
          isLoading={isPending}
          onClick={handleEmailReminder}
        >
          Send Email Reminders
        </Button>
      </div>
      <_DataTable
        columns={columns}
        table={table}
        pagination
        navigateTo={(row) => `/pending-orders/${row.original.id}`}
        filters={filters}
        count={count}
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
