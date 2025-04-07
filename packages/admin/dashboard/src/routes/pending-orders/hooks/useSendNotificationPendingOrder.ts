import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { sdk } from "../../../lib/client"
import { FetchError } from "@medusajs/js-sdk"

export const useSendNotificationPendingOrder = (
  options?: UseMutationOptions<
    any,
    FetchError,
    { email: string; cart_id: string }[]
  >
) => {
  return useMutation({
    mutationFn: async (payload: { email: string; cart_id: string }[]) =>
      sdk.admin.pendingOrder.sendNotification(payload),
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
