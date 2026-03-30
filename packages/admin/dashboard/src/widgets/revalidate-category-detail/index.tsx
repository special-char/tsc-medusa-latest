import { Button } from "@medusajs/ui"
import { useCallback, useState } from "react"
import { storefrontUrl } from "../../lib/client"

interface RevalidateCategoryDetailInStorefrontWidgetProps {
  id: string
  handle: string
}

const RevalidateCategoryDetailInStorefrontWidget = ({
  id,
  handle,
}: RevalidateCategoryDetailInStorefrontWidgetProps) => {
  const [loading, setLoading] = useState(false)

  const handleSyncCategory = useCallback(async () => {
    setLoading(true)
    try {
      await fetch(`${storefrontUrl}/api/revalidate`, {
        method: "POST",
        body: JSON.stringify({
          tags: [
            `categories-${handle}`,
            `categories-filter-${handle}`,
            `categories-priceRange-${id}`,
          ],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      console.error("Error revalidating category:", error)
    } finally {
      setLoading(false)
    }
  }, [id, handle])

  return (
    <Button
      variant="secondary"
      isLoading={loading}
      onClick={handleSyncCategory}
      size="small"
    >
      Sync Cache
    </Button>
  )
}

export default RevalidateCategoryDetailInStorefrontWidget
