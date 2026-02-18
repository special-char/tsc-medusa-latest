import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { sdk } from "../../../lib/client/client"
import { feedsQueryKeys } from "./useFeeds"
import { FetchError } from "@medusajs/js-sdk"

export const useFeed = (
  id: string,
  options?: Omit<
    UseQueryOptions<any, FetchError, any, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      const response = await sdk.client.fetch<{ feed: any }>(
        `/admin/feeds/${id}`
      )
      return response
    },
    queryKey: feedsQueryKeys.detail(id),
    enabled: !!id,
    ...options,
  })

  return { ...data, ...rest }
}
