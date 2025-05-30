import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { AdminProduct, DetailWidgetProps } from "@medusajs/framework/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { useProductVariants } from "./hooks/useProductVariants"
import VariantImagesList from "./components/VariantImagesList"
import { PropsWithChildren } from "react"

const ProductVariantImagesWidgetWrapper = ({ children }: PropsWithChildren) => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Product Variant Images</Heading>
      </div>
      {children}
    </Container>
  )
}

const ProductVariantImagesWidget = ({
  data,
}: DetailWidgetProps<AdminProduct>) => {
  const { variants, isPending, isError, error, refetch } = useProductVariants(
    data.id,
    {
      fields:
        "title,sku,created_at,updated_at,metadata,*product_variant_images",
    }
  )

  if (isPending) {
    return (
      <ProductVariantImagesWidgetWrapper>
        <p className="text-center">Loading...</p>
      </ProductVariantImagesWidgetWrapper>
    )
  }

  if (isError) {
    return (
      <ProductVariantImagesWidgetWrapper>
        <p className="text-center text-rose-500">{error.message}</p>
      </ProductVariantImagesWidgetWrapper>
    )
  }

  if (!variants?.length) {
    return (
      <ProductVariantImagesWidgetWrapper>
        <p className="text-center text-rose-500">
          No any variants found for product id {data?.id}
        </p>
      </ProductVariantImagesWidgetWrapper>
    )
  }

  return (
    <ProductVariantImagesWidgetWrapper>
      {variants && variants.length > 0 ? (
        <VariantImagesList variants={variants} refetch={refetch} />
      ) : (
        <div className="flex flex-col items-center gap-y-4 pb-8 pt-6">
          <Text
            size="small"
            leading="compact"
            weight="plus"
            className="text-ui-fg-subtle"
          >
            No any Variants available
          </Text>
        </div>
      )}
    </ProductVariantImagesWidgetWrapper>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductVariantImagesWidget
