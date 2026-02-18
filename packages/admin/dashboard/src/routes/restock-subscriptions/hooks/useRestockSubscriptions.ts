import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { sdk } from "../../../lib/client"
import { queryKeysFactory } from "../../../lib/query-key-factory"
import { FetchError } from "@medusajs/js-sdk"

const RESTOCK_SUBSCRIPTION_QUERY_KEY = "restock_subscription" as const
export const restockSubscriptionQueryKeys = queryKeysFactory(
  RESTOCK_SUBSCRIPTION_QUERY_KEY
)

export const useRestockSubscriptions = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<any, FetchError, any, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.restockSubscription.list(query),
    queryKey: restockSubscriptionQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
