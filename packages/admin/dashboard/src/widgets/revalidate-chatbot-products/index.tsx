import { Button, Container, Heading, toast } from "@medusajs/ui"
import { useCallback, useState } from "react"
import { sdk } from "../../lib/client"

const RevalidateChatbotProductsWidget = () => {
  const [loading, setLoading] = useState(false)

  const handleSyncProducts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await sdk.admin.chatbot.sync()

      toast.success(data.message || "Sync started")
    } catch (error: any) {
      console.error("Error syncing chatbot products:", error)
      toast.error(error.message || "Failed to trigger chatbot sync")
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
