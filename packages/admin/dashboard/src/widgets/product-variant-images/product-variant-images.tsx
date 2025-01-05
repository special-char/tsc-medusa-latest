import { Container, Heading } from "@medusajs/ui"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { useEffect, useState } from "react"
import { CustomProduct } from "../../types/custom"
import ProductVariantImagesList from "./components/product-variant-images-list"
import { sdk } from "../../lib/client"

const fetchProductData = async (id: string) => {
  const data = await sdk.admin.product.retrieve(id, {
    fields: "+variants.variant_images.*",
  })
  if (data) {
    return data.product as CustomProduct
  }
  return
}

const ProductVariantImagesWidget = ({
  data,
}: DetailWidgetProps<AdminProduct>) => {
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<CustomProduct | null>(null)

  const refetchData = () => {
    setLoading(true)
    fetchProductData(data?.id)
      .then((data) => data && setProduct(data))
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setLoading(true)
    fetchProductData(data?.id)
      .then((data) => data && setProduct(data))
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Container className="divide-y p-0">
        <p className="text-center">Loading...</p>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0 font-sans">
      <Heading level="h2" className="px-6 py-4 font-medium">
        Variant Images - {product?.title}
      </Heading>

      {product ? (
        <ProductVariantImagesList product={product} refetchData={refetchData} />
      ) : (
        <div className="flex h-[200px] items-center justify-center px-6 py-4">
          No product found with id {data?.id}
        </div>
      )}
    </Container>
  )
}

export default ProductVariantImagesWidget
