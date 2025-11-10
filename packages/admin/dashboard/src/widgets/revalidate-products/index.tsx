import { Button, Container, Heading } from "@medusajs/ui"
import { useCallback, useState } from "react"
import { storefrontUrl } from "../../lib/client"

const RevalidateProductsInStorefrontWidget = () => {
  const [loading, setLoading] = useState(false)

  const handleSyncProducts = useCallback(async () => {
    setLoading(true)
    try {
      await fetch(`${storefrontUrl}/api/revalidate`, {
        method: "POST",
        body: JSON.stringify({ tags: ["products"] }),
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
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Sync Cahced Products</Heading>
      </div>
      <Button
        variant="primary"
        isLoading={loading}
        onClick={handleSyncProducts}
      >
        Sync
      </Button>
    </Container>
  )
}

export default RevalidateProductsInStorefrontWidget
