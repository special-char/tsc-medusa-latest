import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/client/client"
import { feedsQueryKeys } from "./useFeeds"
import { FetchError } from "@medusajs/js-sdk"

export const useDeleteFeed = () => {
  const queryClient = useQueryClient()

  return useMutation<any, FetchError, string>({
    mutationFn: async (feedId) => {
      return sdk.client.fetch(`/admin/feeds/${feedId}`, {
        method: "DELETE",
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: feedsQueryKeys.all })
    },
  })
}
