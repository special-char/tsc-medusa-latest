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
    queryKey: [
      "products",
      `organize-product${query?.category_id ? `-${query?.category_id}` : ""}`,
    ],
    ...options,
  })

  return { ...data, ...rest }
}

export const createBatches = <T>(array: T[], batchSize: number): T[][] => {
  const batches: T[][] = []
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize))
  }
  return batches
}

type PayloadType = {
  rank_type_id?: string
  rank_type: string
  productRankMap: {
    id: string
    title: string
    handle: string
    entity_ranks: {
      id: string
      entity_id: string
      rank: 2
      rank_type: string
      rank_type_id?: string
      metadata: null
    }[]
    product_rank: 0
  }[]
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
    mutationFn: async (payload: PayloadType) => {
      const { productRankMap, ...rest } = payload
      const batches = createBatches(productRankMap, 100)

      return Promise.all(
        batches.map(
          async (x) =>
            await sdk.admin.organizeProduct.create({
              ...rest,
              productRankMap: x,
            })
        )
      )
    },
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
