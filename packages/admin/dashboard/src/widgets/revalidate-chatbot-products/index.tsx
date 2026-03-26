import { Button, Container, Heading, toast } from "@medusajs/ui"
import { useCallback, useState } from "react"
import { chatbotUrl, xSyncToken } from "../../lib/client"

const RevalidateChatbotProductsWidget = () => {
  const [loading, setLoading] = useState(false)

  const handleSyncProducts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${chatbotUrl}/admin/sync-products`, {
        method: "POST",
        headers: {
          "x-sync-token": xSyncToken,
        },
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || "Sync started")
      } else {
        toast.error(data.detail || "An error occurred")
      }
    } catch (error) {
      console.error("Error syncing chatbot products:", error)
      toast.error("Failed to connect to the chatbot API")
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <Container className="divide-y">
      <div className="flex items-center justify-between">
        <Heading level="h2">Sync Chatbot Products</Heading>
        <Button
          variant="secondary"
          isLoading={loading}
          onClick={handleSyncProducts}
        >
          Chatbot Sync
        </Button>
      </div>
    </Container>
  )
}

export default RevalidateChatbotProductsWidget
