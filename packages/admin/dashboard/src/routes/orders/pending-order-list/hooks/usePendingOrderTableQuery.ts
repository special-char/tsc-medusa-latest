import { useQueryParams } from "../../../../hooks/use-query-params"

type UsePendingOrderTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const usePendingOrderTableQuery = ({
  prefix,
  pageSize = 20,
}: UsePendingOrderTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "q", "created_at", "updated_at", "payment_status"],
    prefix
  )

  const { offset, created_at, updated_at, payment_status, q } = queryObject

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    payment_status: payment_status?.split(","),
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
