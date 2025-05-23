import { Button, Container } from "@medusajs/ui"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { FetchError } from "@medusajs/js-sdk"
import { sdk } from "../../../../lib/client"

const useSyncProductPrice = (
  options?: Omit<UseMutationOptions<any, FetchError, void>, "mutationFn">
) => {
  const { data, ...rest } = useMutation({
    mutationFn: () => sdk.admin.priceSync.sync(),
    ...options,
  })

  return { ...data, ...rest }
}

const SyncPrice = () => {
  const { mutate: syncPrice, isPending } = useSyncProductPrice()

  const handleSyncPrice = () => {
    syncPrice()
  }

  return (
    <Container>
      <div className="flex items-center gap-4">
        <Button onClick={handleSyncPrice} isLoading={isPending}>
          Sync Product Price (Noble Chain)
        </Button>
      </div>
    </Container>
  )
}

export default SyncPrice
