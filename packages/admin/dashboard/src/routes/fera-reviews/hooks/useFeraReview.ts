import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { sdk } from "../../../lib/client"
import { FetchError } from "@medusajs/js-sdk"
import { FeraReview } from "../types"

export const useFeraReview = (
  id: string,
  query?: {
    limit?: number
    offset?: number
  },
  options?: Omit<
    UseQueryOptions<
      { review: FeraReview },
      FetchError,
      { review: FeraReview },
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => {
      return sdk.client.fetch(`/admin/fera-reviews/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }) as Promise<{ review: FeraReview }>
    },
    queryKey: ["fera-reviews", JSON.stringify(query)],
    ...options,
  })

  return { ...data, ...rest }
}
