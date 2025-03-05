import { Button, Container, Heading, Text } from "@medusajs/ui"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useProductTypeTableFilters } from "../../../../../hooks/table/filters/use-product-type-table-filters"
import { useProductTypeTableQuery } from "../../../../../hooks/table/query/use-product-type-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { TextCell } from "../../../../../components/table/table-cells/common/text-cell"
import { DateCell } from "../../../../../components/table/table-cells/common/date-cell"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "../../../../../lib/client/client"
import { _DataTable } from "../../../../../components/table/data-table"
import { NotificationTemplateRowActions } from "./notification-template-row-actions"

const PAGE_SIZE = 20

// New function to fetch notification
const fetchNotifcation = async (
  searchParams: HttpTypes.AdminProductTypeListParams
) => {
  try {
    const queryString = new URLSearchParams()

    // Iterate over the searchParams object to build the query string
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) {
        // Check if value is defined
        if (typeof value === "object" && value !== null) {
          // Handle nested objects
          for (const [nestedKey, nestedValue] of Object.entries(value)) {
            if (nestedValue !== undefined) {
              // Check if nested value is defined
              queryString.append(`${key}[${nestedKey}]`, nestedValue as string)
            }
          }
        } else {
          queryString.append(key, value)
        }
      }
    }

    console.log("🚀 ~ queryString:", queryString.toString())
    // Convert searchParams to query string

    const response =
      await sdk.admin.notificationTemplate.listTemplate(queryString)
    if (!response) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch Notification")
    }
    const result = response
    return result // Return the Notification array
  } catch (error) {
    console.error(error)
    throw error // Rethrow the error for handling in the component
  }
}
export type Event = {
  id?: string

  eventName?: string

  tags?: Record<string, any>

  created_at?: string

  updated_at?: string

  deleted_at?: string | null
}

// Define a type for the brand data
export interface NotificationTemplate {
  id?: string

  template?: string

  event_id_id?: string

  created_at?: string

  updated_at?: string

  deleted_at?: string | null

  event_id?: Event
}

export const NotificationTemplateListTable = () => {
  const { t } = useTranslation()
  const { searchParams, raw } = useProductTypeTableQuery({
    pageSize: PAGE_SIZE,
  })
  const filters = useProductTypeTableFilters()

  const [notificationTemplate, setNotificationTemplate] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [count, setCount] = useState(0)
  const columns = useColumns(setNotificationTemplate)
  const [prevSearchParams, setPrevSearchParams] = useState(null)
  useEffect(() => {
    const loadBrands = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        const fetchedNotification = await fetchNotifcation(searchParams)
        console.log(
          "🚀 ~ loadBrands ~ fetchedNotification:",
          fetchedNotification.data
        )
        setNotificationTemplate(fetchedNotification.data)
        setCount(fetchedNotification.data.length)
      } catch (error) {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
    if (
      JSON.stringify(prevSearchParams) !== JSON.stringify(searchParams) ||
      prevSearchParams == null
    ) {
      loadBrands()
      setPrevSearchParams(searchParams) // Update previous searchParams
    }
  }, [searchParams])

  const { table } = useDataTable<NotificationTemplate>({
    columns,
    data: notificationTemplate,
    count,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    return <div>Error loading notification. Please try again later.</div> // Show error message
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{"Notification Template List"}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {"Organize your notification template"}
          </Text>
        </div>
        <Button size="small" variant="secondary" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>
      <_DataTable
        table={table}
        filters={filters}
        isLoading={isLoading}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        // navigateTo={({ original }) => original.id}
        queryObject={raw}
        orderBy={[
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        pagination
        search
      />
    </Container>
  )
}

const useColumns = (
  setNotificationTemplates: (notificationTemplates: any[]) => void
) => {
  const { t } = useTranslation()
  return useMemo<ColumnDef<NotificationTemplate>[]>(
    () => [
      {
        accessorKey: "event_id.eventName", // Matches the 'name' key in the brand object
        header: () => "event name",
        cell: ({ getValue }) => <TextCell text={getValue() as string} />,
      },
      {
        accessorKey: "template", // Matches the 'name' key in the brand object
        header: () => "Template",
        cell: ({ getValue }) => <TextCell text={getValue() as string} />,
      },
      {
        accessorKey: "created_at",
        header: () => t("fields.createdAt"),
        cell: ({ getValue }) => {
          const dateValue = getValue() as string
          return <DateCell date={new Date(dateValue)} />
        },
      },
      {
        accessorKey: "updated_at", // Matches the 'updated_at' key
        header: () => t("fields.updatedAt"),
        cell: ({ getValue }) => {
          const dateValue = getValue() as string // Ensure it's treated as a string
          return <DateCell date={new Date(dateValue)} /> // Pass a Date object
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <NotificationTemplateRowActions
              notificationTemplate={row.original}
            />
          ) // Update to use the correct prop
        },
      },
    ],
    [t]
  )
}
