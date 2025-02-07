import SeoDetails from "./components/seo/SeoDetails"
import SeoForm from "./components/seo/SeoForm"
import { Button, Container, FocusModal } from "@medusajs/ui"

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"
import { sdk } from "../../../../../lib/client"
// import { SeoDetailsTypes } from "../../../modules/product-seo/models/seo-details"

export type SeoSocialTypes = {
  id?: string
  title: string | null
  description: string | null
  image?: string | null
  socialNetwork: "Facebook" | "Twitter" | "Instagram"
  seo_details_id?: SeoDetailsTypes["id"]
}

export type SeoDetailsTypes = {
  id?: string
  metaTitle: string | null
  metaDescription: string | null
  metaImage: string | null
  metaSocial: SeoSocialTypes[]
  keywords: string | null
  metaRobots: string | null
  structuredData: Record<string, any> | null
  feedData: Record<string, any> | null
  metaViewport: string | null
  canonicalURL: string | null
}
const fetchProductWithSeo = async (
  id: string
): Promise<{ data: SeoDetailsTypes }> => {
  const response = sdk.admin.productSeo.retrieveById(id)
  return response
}

const ProductSeoWidget = ({ product: data }: { product: any }) => {
  const [productSeo, setProductSeo] = useState<SeoDetailsTypes>()

  console.log({ data })
  useEffect(() => {
    fetchProductWithSeo(data.id).then((res) => {
      setProductSeo(res.data)
    })
    return () => {}
  }, [])

  return (
    <Container>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-xlarge font-bold">Product SEO: {data.title}</h3>
        <div className="flex items-center gap-4">
          <FocusModal modal>
            <FocusModal.Trigger asChild>
              <Button variant="transparent" className="border">
                {!productSeo ? "Add" : "Edit"}
              </Button>
            </FocusModal.Trigger>
            <FocusModal.Content>
              <FocusModal.Header>SEO</FocusModal.Header>
              <FocusModal.Body className="flex flex-col items-center overflow-y-scroll py-16">
                <SeoForm product={data} productSeo={productSeo} />
              </FocusModal.Body>
            </FocusModal.Content>
          </FocusModal>
        </div>
      </div>
      {productSeo ? (
        <SeoDetails productSeo={productSeo} />
      ) : (
        <>No any SEO available</>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
})

export default ProductSeoWidget
