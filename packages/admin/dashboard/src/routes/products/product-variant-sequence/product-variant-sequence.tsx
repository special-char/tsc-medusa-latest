import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import { useProduct } from "../../../hooks/api/products"
import { VariantSequenceForm } from "./components/variant-sequence-form"
import { Spinner } from "@medusajs/icons"
import { Text, toast } from "@medusajs/ui"

export const ProductVariantSequence = () => {
  const { id } = useParams()

  const { product, isLoading, isError, error } = useProduct(id!, {
    fields: "+options.title,+options.id,-variants",
  })

  if (isError) {
    toast.error("Product Variant Sequence Failed", {
      description: error.message,
    })
  }

  return (
    <RouteFocusModal>
      {isLoading && (
        <RouteFocusModal.Body>
          <div className="flex h-full flex-col items-center justify-center gap-y-4">
            <Spinner className="text-ui-fg-interactive animate-spin" />
            <Text className="text-ui-fg-subtle">Loading Product...</Text>
          </div>
        </RouteFocusModal.Body>
      )}

      {!isLoading && product && <VariantSequenceForm product={product} />}
    </RouteFocusModal>
  )
}
