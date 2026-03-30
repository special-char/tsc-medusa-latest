import { Button, Container, Heading } from "@medusajs/ui"
import { useCallback, useState } from "react"
import { storefrontUrl } from "../../lib/client"

const RevalidateCategoriesInStorefrontWidget = () => {
  const [loading, setLoading] = useState(false)

  const handleSyncCategories = useCallback(async () => {
    setLoading(true)
    try {
      await fetch(`${storefrontUrl}/api/revalidate`, {
        method: "POST",
        body: JSON.stringify({
          tags: ["categories"],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      console.error("Error revalidating categories:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <Container className="divide-y">
      <div className="flex items-center justify-between">
        <Heading level="h2">Sync Cached Categories</Heading>
        <Button
          variant="secondary"
          isLoading={loading}
          onClick={handleSyncCategories}
        >
          Sync
        </Button>
      </div>
    </Container>
  )
}

export default RevalidateCategoriesInStorefrontWidget
