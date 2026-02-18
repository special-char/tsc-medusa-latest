import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { sdk } from "../../../lib/client/client"
import { queryKeysFactory } from "../../../lib/query-key-factory"
import { FetchError } from "@medusajs/js-sdk"

const FEEDS_QUERY_KEY = "feeds" as const
export const feedsQueryKeys = queryKeysFactory(FEEDS_QUERY_KEY)

export const useFeeds = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<any, FetchError, any, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      const response = await sdk.client.fetch<{ feeds: any[] }>("/admin/feeds")
      return response
    },
    queryKey: feedsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
