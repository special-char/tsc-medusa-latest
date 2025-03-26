import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import {
  QueryClient,
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"
import { sdk } from "../../../lib/client"

const queryKey = ["product-sort-by-category"]

export const useProducts = (
  query?: HttpTypes.AdminProductListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminProductListResponse,
      FetchError,
      HttpTypes.AdminProductListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.product.list(query),
    queryKey: queryKey,
    ...options,
  })

  return { ...data, ...rest }
}

export const useUpdateProductsRank = (
  options?: UseMutationOptions<
    HttpTypes.AdminProductResponse | any,
    FetchError,
    HttpTypes.AdminCreateProduct | any
  >
) => {
  const queryClient = new QueryClient({})

  return useMutation({
    mutationFn: async (payload) => {
      return fetch("http://localhost:9000/admin/organize-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: queryKey,
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
