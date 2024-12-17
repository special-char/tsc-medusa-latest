import { Container, Heading } from "@medusajs/ui"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { useEffect, useState } from "react"
import { CustomProduct } from "../../types/custom"
import ProductVariantImagesList from "./components/product-variant-images-list"
import { backendUrl } from "../../lib/client"

const fetchProductData = async (id: string) => {
  const res = await fetch(
    `${backendUrl}/admin/products/${id}?fields=+variants.variant_images.*`,
    {
      credentials: "include",
    }
  )
  const data = await res.json()
  return data.product
}

const ProductVariantImagesWidget = ({
  data,
}: DetailWidgetProps<AdminProduct>) => {
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<CustomProduct | null>(null)

  const refetchData = () => {
    setLoading(true)
    fetchProductData(data?.id)
      .then((data) => setProduct(data))
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setLoading(true)
    fetchProductData(data?.id)
      .then((data) => setProduct(data))
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Container className="p-0 divide-y">
        <p className="text-center">Loading...</p>
      </Container>
    )
  }

  return (
    <Container className="p-0 divide-y font-sans">
      <Heading level="h2" className="font-medium px-6 py-4">
        Variant Images - {product?.title}
      </Heading>

      {product ? (
        <ProductVariantImagesList product={product} refetchData={refetchData} />
      ) : (
        <div className="px-6 py-4 h-[200px] flex items-center justify-center">
          No product found with id {data?.id}
        </div>
      )}
    </Container>
  )
}

export default ProductVariantImagesWidget
