import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { sdk } from "../../../lib/client"
import { ordersQueryKeys } from "../../../hooks/api"
import { FetchError } from "@medusajs/js-sdk"

type PendingOrders = {
  cart: any
}

export const usePendingOrder = (
  id: string,
  query?: {
    limit?: number
    offset?: number
  },
  options?: Omit<
    UseQueryOptions<PendingOrders, FetchError, PendingOrders, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.pendingOrder.retrieve(id),
    queryKey: ordersQueryKeys.list({ ...query, id }),
    ...options,
  })

  return { ...data, ...rest }
}
