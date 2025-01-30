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
import { BrandRowActions } from "./brand-row-actions"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "../../../../../lib/client/client"
import { getSalesChannelIds } from "../../../../../const/get-sales-channel"
import { _DataTable } from "../../../../../components/table/data-table"

const PAGE_SIZE = 20

// New function to fetch brands
const fetchBrands = async (
  searchParams: HttpTypes.AdminProductTypeListParams
) => {
  try {
    const queryString = new URLSearchParams()
    const salesChannelIds = getSalesChannelIds()
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
    salesChannelIds && salesChannelIds[0] && salesChannelIds[0].length != 0
      ? queryString.append("sales_channel", salesChannelIds[0].toString())
      : null

    // Convert searchParams to query string

    const response = await sdk.admin.brand.list(queryString)
    if (!response) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch brands")
    }
    const result = response
    return result // Return the brands array
  } catch (error) {
    console.error(error)
    throw error // Rethrow the error for handling in the component
  }
}

// Define a type for the brand data
export interface Brand {
  [x: string]: any
  id: string // Assuming there is an id field
  name: string
  created_at: string
  updated_at: string
}

export const BrandListTable = () => {
  const { t } = useTranslation()
  const { searchParams, raw } = useProductTypeTableQuery({
    pageSize: PAGE_SIZE,
  })
  const filters = useProductTypeTableFilters()

  const [brands, setBrands] = useState([])
  const [isLoading, setIsLoading] = useState(false) // Local loading state for fetchBrands
  const [isError, setIsError] = useState(false) // Local error state for fetchBrands
  const [prevSearchParams, setPrevSearchParams] = useState(null) // State to hold previous searchParams
  const [count, setCount] = useState(0)
  const columns = useColumns(setBrands)
  useEffect(() => {
    const loadBrands = async () => {
      setIsLoading(true) // Set loading to true before fetching
      setIsError(false)
      try {
        const fetchedBrands = await fetchBrands(searchParams)
        setBrands(fetchedBrands.brands)
        setCount(fetchedBrands.count)
      } catch (error) {
        setIsError(true)
      } finally {
        setIsLoading(false) // Set loading to false after fetching
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

  const { table } = useDataTable<Brand>({
    columns,
    data: brands,
    count,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    return <div>Error loading brands. Please try again later.</div> // Show error message
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{"Brand List"}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {"Organize your Brands"}
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
        navigateTo={({ original }) => original.id}
        queryObject={raw}
        orderBy={[
          { key: "name", label: t("fields.name") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        pagination
        search
      />
    </Container>
  )
}

const useColumns = (setBrands: (brands: any[]) => void) => {
  const { t } = useTranslation()
  return useMemo<ColumnDef<Brand>[]>(
    () => [
      {
        accessorKey: "name", // Matches the 'name' key in the brand object
        header: () => t("fields.name"),
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
          return <BrandRowActions brand={row.original} setBrands={setBrands} /> // Update to use the correct prop
        },
      },
    ],
    [t]
  )
}
