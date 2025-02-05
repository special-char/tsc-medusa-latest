import { Container, Heading, Tooltip } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import CustomTable from "../../../components/common/CustomTable"
import { useEffect, useState } from "react"
import { sdk } from "../../../lib/client"
import { format } from "date-fns"
import { DataTableQuery } from "../../../components/table/data-table/data-table-query"
import { t } from "i18next"
import { Filter } from "../../../components/table/data-table"
import { useRedemption } from "../../../hooks/api/redemption"
import { useRedemptionTableQuery } from "../../../hooks/table/query/use-redemption-table-query"
import { keepPreviousData } from "@tanstack/react-query"
import { useDataTable } from "../../../hooks/use-data-table"
import { DEFAULT_FIELDS } from "../const"
import { NoRecords } from "../../../components/common/empty-table-content"
import { getVendorId } from "../../../const/get-sales-channel"

const listVendors = async () => {
  const response = await sdk.vendor.retrieve()
  return response
}

export function RedemptionDetail() {
  const [vendor, setVendor] = useState<any>([])
  const PAGE_SIZE = 10
  const { raw, searchParams } = useRedemptionTableQuery({
    pageSize: PAGE_SIZE,
  })

  const vendorId = getVendorId()
  console.log("🚀 ~ RedemptionDetail ~ vendorId:", vendorId)
  const { histories, count, isError, error, isLoading } = useRedemption(
    {
      fields: DEFAULT_FIELDS,
      ...searchParams,
      ...(vendorId?.trim() ? { vendor_id: vendorId } : {}),
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columnHelper = createColumnHelper<any>()

  const columns = [
    columnHelper.accessor("product_id", {
      header: "Product Title",
      cell: (info) => {
        return (
          <span className="line-clamp-1 w-[80px] overflow-hidden">
            <a
              href={`/products/${info.row.original?.redemption_id?.product_id}`}
              className="text-blue-500 underline"
            >
              {info.row.original.product_title}
            </a>
          </span>
        )
      },
    }),
    columnHelper.accessor("order_id", {
      header: "Order Id",
      cell: (info) => {
        return (
          <Tooltip
            maxWidth={260}
            content={info.row.original?.redemption_id?.order_id}
          >
            <span className="line-clamp-1 w-[90px] overflow-hidden">
              <a
                href={`/orders/${info.row.original?.redemption_id?.order_id}`}
                className="text-blue-500 underline"
              >
                {info.row.original?.redemption_id?.order_id.slice(-7)}
              </a>
            </span>
          </Tooltip>
        )
      },
    }),
    columnHelper.accessor("gift_code", {
      header: "Gift Code",
      cell: (info) => {
        return (
          <span className="line-clamp-1 w-[150px] overflow-hidden">
            {info.row.original.gift_card_code}
          </span>
        )
      },
    }),
    columnHelper.accessor("vendor_id", {
      header: "Vendor Name",
      cell: (info) => {
        const vendorName = vendor.find(
          (x: any) => x?.id === info.row.original.vendor_id
        )?.name

        return (
          <span className="line-clamp-1 w-[100px] overflow-hidden">
            {info.row.original.vendor_name}
          </span>
        )
      },
    }),
    columnHelper.accessor("amount_spent", {
      header: "Amount Spent",
      cell: (info) => (
        <span className="line-clamp-1 w-[90px] overflow-hidden">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => (
        <span className="line-clamp-1 w-[90px] overflow-hidden">
          {info.row.original.redemption_id?.amount}
        </span>
      ),
    }),
    columnHelper.accessor("amount_remaining", {
      header: "Balance",
      cell: (info) => (
        <span className="line-clamp-1 w-[90px] overflow-hidden">
          {info.row.original?.amount_remaining}
        </span>
      ),
    }),
    columnHelper.accessor("where_deducted", {
      header: "Where Deducted",
      cell: (info) => (
        <span className="line-clamp-1 w-[100px] overflow-hidden">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("created_at", {
      header: "Used On",
      cell: (info) => (
        <span className="line-clamp-1 w-[200px] overflow-hidden">
          {format(info.getValue(), "dd/MM/yyy hh:mm:ss")}
        </span>
      ),
    }),
  ]

  const { table } = useDataTable({
    data: histories ?? [],
    columns,
    enablePagination: true,
    count,
    pageSize: PAGE_SIZE,
  })

  useEffect(() => {
    listVendors().then((res) => setVendor(res.data))
  }, [])
  const dateFilters: Filter[] = [{ label: "Used On", key: "created_at" }].map(
    (f) => ({
      key: f.key,
      label: f.label,
      type: "date",
    })
  )

  return (
    <Container>
      <Heading>Redemptions</Heading>
      <div className="my-4">
        <DataTableQuery
          search
          orderBy={[
            { key: "id", label: "Id" },
            { key: "created_at", label: t("fields.createdAt") },
            { key: "updated_at", label: t("fields.updatedAt") },
            { label: "Balance", key: "amount_remaining" },
          ]}
          filters={dateFilters}
        />
        {histories && histories.length > 0 ? (
          <CustomTable PAGE_SIZE={PAGE_SIZE} data={histories} table={table} />
        ) : (
          <NoRecords
            title={t("general.noResultsTitle")}
            message={t("general.noResultsMessage")}
          />
        )}
      </div>
    </Container>
  )
}
