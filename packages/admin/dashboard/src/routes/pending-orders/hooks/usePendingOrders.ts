import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { sdk } from "../../../lib/client"
import { ordersQueryKeys } from "../../../hooks/api"
import { FetchError } from "@medusajs/js-sdk"

type PendingOrders = {
  carts: any
  count: number
  limit: number
  offset: number
}

export const usePendingOrders = (
  query?: {
    limit?: number
    offset?: number
    payment_method?: string[]
    created_at?: string | Date
    updated_at?: string | Date
    q?: string
  },
  options?: Omit<
    UseQueryOptions<PendingOrders, FetchError, PendingOrders, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.pendingOrder.list(query),
    queryKey: ordersQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
