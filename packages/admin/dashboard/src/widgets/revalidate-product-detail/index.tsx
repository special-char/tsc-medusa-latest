import { Button } from "@medusajs/ui"
import { useCallback, useState } from "react"
import { storefrontUrl } from "../../lib/client"

const RevalidateProductDetailInStorefrontWidget = ({
  handle,
}: {
  handle: string
}) => {
  const [loading, setLoading] = useState(false)

  const handleSyncProducts = useCallback(async () => {
    setLoading(true)
    try {
      await fetch(`${storefrontUrl}/api/revalidate`, {
        method: "POST",
        body: JSON.stringify({ tags: [`product-${handle}`] }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      console.error("Error revalidating products:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <Button
      variant="secondary"
      isLoading={loading}
      onClick={handleSyncProducts}
      size="small"
    >
      Sync Cache
    </Button>
  )
}

export default RevalidateProductDetailInStorefrontWidget
