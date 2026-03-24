import { Button, toast } from "@medusajs/ui"
import { useCallback, useState } from "react"
import { sdk } from "../../../../../lib/client"

const RevalidateMeilisearchProduct = ({ productId }: { productId: string }) => {
  const [loading, setLoading] = useState(false)

  const handleSyncProduct = useCallback(async () => {
    setLoading(true)
    try {
      await sdk.admin.meilisearch.productListSyncProduct(productId)
      toast.success("Success", {
        description: "Product sync started for Meilisearch",
      })
    } catch (error) {
      console.error("Error syncing product to Meilisearch:", error)
      toast.error("Error", {
        description: "Failed to sync product to Meilisearch",
      })
    } finally {
      setLoading(false)
    }
  }, [productId])

  return (
    <Button
      variant="secondary"
      isLoading={loading}
      onClick={handleSyncProduct}
      size="small"
    >
      Sync Meilisearch
    </Button>
  )
}

export default RevalidateMeilisearchProduct
