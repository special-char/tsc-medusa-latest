import { Container, Heading } from "@medusajs/ui"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import ProductVariantImagesList from "./components/product-variant-images-list"
import { useProductVariants } from "../../hooks/api"

const ProductVariantImagesWidget = ({
  data,
}: DetailWidgetProps<AdminProduct>) => {
  const { variants, isPending, isError, error, refetch } = useProductVariants(
    data.id,
    {
      order: "variant_rank",
      fields:
        "*inventory_items.inventory.location_levels,+inventory_quantity,*variant_images",
    }
  )

  if (isPending) {
    return (
      <Container className="divide-y px-6 py-10">
        <p className="text-center">Loading...</p>
      </Container>
    )
  }

  if (isError) {
    return (
      <Container className="divide-y px-6 py-10">
        <p className="text-center text-rose-500">{error.message}</p>
      </Container>
    )
  }

  if (!variants?.length) {
    return (
      <Container className="divide-y px-6 py-10">
        <p className="text-center text-rose-500">
          No any variants found for product id {data?.id}
        </p>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0 font-sans">
      <Heading level="h2" className="px-6 py-4 font-medium">
        Variant Images - {data?.title}
      </Heading>

      {data && variants ? (
        <ProductVariantImagesList
          product={data}
          variants={variants}
          refetchData={refetch}
        />
      ) : (
        <div className="flex h-[200px] items-center justify-center px-6 py-4">
          No any variants found for product id {data?.id}
        </div>
      )}
    </Container>
  )
}

export default ProductVariantImagesWidget
