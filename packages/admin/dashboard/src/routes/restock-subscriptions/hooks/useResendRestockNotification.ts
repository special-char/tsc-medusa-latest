import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { sdk } from "../../../lib/client"
import { FetchError } from "@medusajs/js-sdk"

export const useResendRestockNotification = (
  id: string,
  options?: UseMutationOptions<any, FetchError, void>
) => {
  return useMutation({
    mutationFn: () => sdk.admin.restockSubscription.resend(id),
    ...options,
  })
}
