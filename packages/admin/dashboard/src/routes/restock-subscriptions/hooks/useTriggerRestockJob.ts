import { useMutation } from "@tanstack/react-query"
import { sdk } from "../../../lib/client"
import { FetchError } from "@medusajs/js-sdk"

export const useTriggerRestockJob = () => {
  return useMutation<any, FetchError, string[] | undefined>({
    mutationFn: async (subscriptionIds?: string[]) => {
      return sdk.client.fetch("/admin/restock-subscriptions/trigger-job", {
        method: "POST",
        body: subscriptionIds
          ? { subscription_ids: subscriptionIds }
          : undefined,
      })
    },
    onError: (error: FetchError) => {
      console.error("Failed to trigger restock job:", error)
    },
  })
}
