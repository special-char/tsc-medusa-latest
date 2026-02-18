import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/client/client"
import { feedsQueryKeys } from "./useFeeds"
import { FetchError } from "@medusajs/js-sdk"

export const useUpdateFeed = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation<any, FetchError, Record<string, any>>({
    mutationFn: async (data) => {
      return sdk.client.fetch(`/admin/feeds/${id}`, {
        method: "POST",
        body: data,
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: feedsQueryKeys.all })
    },
  })
}
