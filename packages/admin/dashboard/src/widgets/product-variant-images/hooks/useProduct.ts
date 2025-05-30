import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { sdk } from "../../../lib/client"

const PRODUCTS_QUERY_KEY = "products" as const

export const useProduct = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminProductResponse,
      FetchError,
      HttpTypes.AdminProductResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => await sdk.admin.product.retrieve(id, query),
    queryKey: [PRODUCTS_QUERY_KEY, id, JSON.stringify(query)],
    ...options,
  })

  return { ...data, ...rest }
}
