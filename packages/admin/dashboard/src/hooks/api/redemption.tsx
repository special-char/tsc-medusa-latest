import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryKeysFactory, TQueryKey } from "../../lib/query-key-factory"

const ORDERS_QUERY_KEY = "histories" as const
const _redemption_keys = queryKeysFactory(
  ORDERS_QUERY_KEY
) as TQueryKey<"histories"> & {
  preview: (orderId: string) => any
  changes: (orderId: string) => any
  lineItems: (orderId: string) => any
}

_redemption_keys.preview = function (id: string) {
  return [this.detail(id), "preview"]
}

_redemption_keys.changes = function (id: string) {
  return [this.detail(id), "changes"]
}

_redemption_keys.lineItems = function (id: string) {
  return [this.detail(id), "lineItems"]
}

export const redemptionKeys = _redemption_keys

export const useRedemption = (
  query?: HttpTypes.FindParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminOrderListResponse,
      FetchError,
      HttpTypes.AdminOrderListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.redemption.retrieveHistories(query),
    queryKey: redemptionKeys.list(query),
    ...options,
  })
  return { ...data, ...rest }
}
