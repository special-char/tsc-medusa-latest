import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/client/client"
import { feedsQueryKeys } from "./useFeeds"
import { FetchError } from "@medusajs/js-sdk"

export const useGenerateFeed = () => {
  const queryClient = useQueryClient()

  return useMutation<any, FetchError, string>({
    mutationFn: async (feedId) => {
      return sdk.client.fetch(`/admin/feeds/${feedId}/generate`, {
        method: "POST",
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: feedsQueryKeys.all })
    },
  })
}
