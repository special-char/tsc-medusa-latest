import { PencilSquare } from "@medusajs/icons"
import { Button, Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { HttpTypes } from "@medusajs/types"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useCustomers } from "../../../../../hooks/api/customers"
import { useCustomerTableColumns } from "../../../../../hooks/table/columns/use-customer-table-columns"
import { useCustomerTableFilters } from "../../../../../hooks/table/filters/use-customer-table-filters"
import { useCustomerTableQuery } from "../../../../../hooks/table/query/use-customer-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { getSalesChannelIds } from "../../../../../const/get-sales-channel"
import { fromLayeredEmail } from "../../../../../const/get-layered-email"

const PAGE_SIZE = 20

export const CustomerListTable = () => {
  const { t } = useTranslation()
  const salesChannelIds = getSalesChannelIds()
  const { searchParams, raw } = useCustomerTableQuery({ pageSize: PAGE_SIZE })
  const {
    customers: allCustomer,
    count,
    isLoading,
    isError,
    error,
  } = useCustomers(
    {
      ...searchParams,
      fields: "*sales_channel.id",
      limit: Number.MAX_SAFE_INTEGER,
      offset: 0,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  // Filter current page data
  const filteredCustomer =
    salesChannelIds && salesChannelIds[0] && salesChannelIds[0].length != 0
      ? allCustomer?.filter(
          (x: any) => x.sales_channel?.id === salesChannelIds[0]
        )
      : allCustomer

  // Calculate total filtered count
  const filteredCount = filteredCustomer?.length ?? 0

  // Apply pagination to filtered results
  const startIndex = searchParams.offset ?? 0
  const endIndex = startIndex + PAGE_SIZE
  const paginatedCustomer = filteredCustomer?.slice(startIndex, endIndex)
  const filters = useCustomerTableFilters()
  const columns = useColumns()
  const data = paginatedCustomer?.map((customer) => {
    const { email, salesChannelId } = fromLayeredEmail(customer.email)
    return {
      ...customer, // Keep the existing fields
      email, // Replace the layered email with the original email
      salesChannelId, // Add the extracted salesChannelId
    }
  })

  const { table } = useDataTable({
    data: data ?? [],
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
        <Heading>{t("customers.domain")}</Heading>
        <Link to="/customers/create">
          <Button size="small" variant="secondary">
            {t("actions.create")}
          </Button>
        </Link>
      </div>
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={filteredCount}
        filters={filters}
        orderBy={[
          { key: "email", label: t("fields.email") },
          { key: "first_name", label: t("fields.firstName") },
          { key: "last_name", label: t("fields.lastName") },
          { key: "has_account", label: t("customers.hasAccount") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        isLoading={isLoading}
        navigateTo={(row) => row.original.id}
        search
        queryObject={raw}
        noRecords={{
          message: t("customers.list.noRecordsMessage"),
        }}
      />
    </Container>
  )
}

const CustomerActions = ({
  customer,
}: {
  customer: HttpTypes.AdminCustomer
}) => {
  const { t } = useTranslation()

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/customers/${customer.id}/edit`,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminCustomer>()

const useColumns = () => {
  const columns = useCustomerTableColumns()

  return useMemo(
    () => [
      ...columns,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <CustomerActions customer={row.original} />,
      }),
    ],
    [columns]
  )
}
