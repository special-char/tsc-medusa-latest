import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { sdk } from "../../../lib/client"
import { FetchError } from "@medusajs/js-sdk"
import { FeraReviewsResponse } from "../types"

export const useFeraReviews = (
  query?: {
    limit?: number
    offset?: number
  },
  options?: Omit<
    UseQueryOptions<
      FeraReviewsResponse,
      FetchError,
      FeraReviewsResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => {
      return sdk.client.fetch(`/admin/fera-reviews`, {
        query: {
          limit: 10,
          ...query,
        },
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }) as Promise<FeraReviewsResponse>
    },
    queryKey: ["fera-reviews", JSON.stringify(query)],
    ...options,
  })

  return { ...data, ...rest }
}
