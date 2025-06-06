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
    UseQueryOptions<FeraReview, FetchError, FeraReview, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  console.log("useFeraReview called with ID:", id)

  const { data, ...rest } = useQuery({
    queryFn: async () => {
      console.log("Making API request to:", `/admin/fera-reviews/${id}`)
      try {
        const response = await sdk.client.fetch(`/admin/fera-reviews/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        console.log("API Response:", response)
        // The API returns a single review directly
        return response as FeraReview
      } catch (error) {
        console.error("API Error:", error)
        throw error
      }
    },
    queryKey: ["fera-reviews", id, JSON.stringify(query)],
    ...options,
  })

  return { review: data, ...rest }
}
