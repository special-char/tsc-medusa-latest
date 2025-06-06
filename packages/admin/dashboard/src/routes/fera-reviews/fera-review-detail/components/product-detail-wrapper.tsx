import { clx } from "@medusajs/ui"
import { Skeleton } from "../../../../components/common/skeleton"
import { useProduct } from "../../../../hooks/api"
import { ProductGeneralSection } from "./fera-review-product-setion"

const ProductDetailWrapper = ({ product_id }: { product_id: string }) => {
  const { product, isLoading, isError, error } = useProduct(product_id)

  if (isLoading) {
    return <Skeleton className={clx("h-[219px] w-full rounded-lg", {})} />
  }

  if (isError || !product) {
    console.error("Error state:", error)
    return null
  }

  return (
    <>
      <ProductGeneralSection product={product!} />
    </>
  )
}

export default ProductDetailWrapper
