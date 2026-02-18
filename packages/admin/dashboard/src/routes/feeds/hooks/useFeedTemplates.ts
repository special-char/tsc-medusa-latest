import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { sdk } from "../../../lib/client/client"
import { queryKeysFactory } from "../../../lib/query-key-factory"
import { FetchError } from "@medusajs/js-sdk"

const FEED_TEMPLATES_QUERY_KEY = "feed_templates" as const
export const feedTemplatesQueryKeys = queryKeysFactory(FEED_TEMPLATES_QUERY_KEY)

export const useFeedTemplates = (
  options?: Omit<
    UseQueryOptions<any, FetchError, any, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      const response = await sdk.client.fetch<{ templates: any[] }>(
        "/admin/feeds/templates"
      )
      return response
    },
    queryKey: feedTemplatesQueryKeys.list(),
    ...options,
  })

  return { ...data, ...rest }
}
