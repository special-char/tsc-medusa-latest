import { useQueryParams } from "../../../hooks/use-query-params"

type UseRestockSubscriptionTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useRestockSubscriptionTableQuery = ({
  prefix,
  pageSize = 20,
}: UseRestockSubscriptionTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "q", "status", "variant_id", "customer_id", "email"],
    prefix
  )

  const { offset, status, variant_id, customer_id, email, q } = queryObject

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    status: status?.split(","),
    variant_id: variant_id?.split(","),
    customer_id: customer_id?.split(","),
    email,
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
