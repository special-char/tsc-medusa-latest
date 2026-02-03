import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import { useProduct } from "../../../hooks/api/products"
import { TieredPricingEdit } from "../product-detail/components/product-tiered-pricing-section/tiered-pricing-edit"

export function ProductTieredPricing() {
  const { id } = useParams()

  const { product, isLoading, isError, error } = useProduct(id!, {
    fields: "+variants,+variants.prices",
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && product && <TieredPricingEdit product={product} />}
    </RouteFocusModal>
  )
}
