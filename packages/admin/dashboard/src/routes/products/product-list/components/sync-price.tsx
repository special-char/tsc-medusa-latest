import { Button, Container } from "@medusajs/ui"
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { FetchError } from "@medusajs/js-sdk"
import { sdk } from "../../../../lib/client"

const useSyncProductPrice = (
  options?: Omit<
    UseQueryOptions<any, FetchError, any, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.priceSync.sync(),
    queryKey: ["sync-product-price"],
    ...options,
  })

  return { ...data, ...rest }
}

const SyncPrice = () => {
  const { isLoading } = useSyncProductPrice()

  const handleSyncPrice = () => {}

  return (
    <Container>
      <div className="flex items-center gap-4">
        <Button onClick={handleSyncPrice} isLoading={isLoading}>
          Sync Product Price (Noble Chain)
        </Button>
      </div>
    </Container>
  )
}

export default SyncPrice
