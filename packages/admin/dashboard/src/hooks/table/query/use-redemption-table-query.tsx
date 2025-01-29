import { HttpTypes } from "@medusajs/types"
import { useQueryParams } from "../../use-query-params"

type UseRedemptionTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useRedemptionTableQuery = ({
  prefix,
  pageSize = 20,
}: UseRedemptionTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "q", "created_at", "updated_at", "order"],
    prefix
  )

  const { offset, created_at, updated_at, q, order } = queryObject

  const searchParams: HttpTypes.AdminOrderFilters = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    order: order ? order : "-id",
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
