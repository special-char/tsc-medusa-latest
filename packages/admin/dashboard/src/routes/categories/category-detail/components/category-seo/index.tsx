import { Button, Container, FocusModal } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { sdk } from "../../../../../lib/client"
import { AdminProductCategory } from "@medusajs/types"
import CategorySeoForm from "./components/seo/CategorySeoForm"
import SeoDetails from "../../../../products/product-detail/components/product-seo/components/seo/SeoDetails"

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
const fetchCategoryWithSeo = async (
  id: string
): Promise<{ data: SeoDetailsTypes }> => {
  const response = sdk.admin.categorySeo.retrieveById(id)
  return response
}

const CategorySeoWidget = ({
  category: data,
}: {
  category: AdminProductCategory
}) => {
  const [categorySeo, setCategorySeo] = useState<SeoDetailsTypes>()

  useEffect(() => {
    fetchCategoryWithSeo(data.id).then((res) => {
      setCategorySeo(res.data)
    })
    return () => {}
  }, [])

  return (
    <Container>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-xlarge font-bold">Category SEO: {data.name}</h3>
        <div className="flex items-center gap-4">
          <FocusModal modal>
            <FocusModal.Trigger asChild>
              <Button variant="transparent" className="border">
                {!categorySeo ? "Add" : "Edit"}
              </Button>
            </FocusModal.Trigger>
            <FocusModal.Content>
              <FocusModal.Header>SEO</FocusModal.Header>
              <FocusModal.Body className="flex flex-col items-center overflow-y-scroll py-16">
                <CategorySeoForm category={data} categorySeo={categorySeo} />
              </FocusModal.Body>
            </FocusModal.Content>
          </FocusModal>
        </div>
      </div>
      {categorySeo ? (
        <SeoDetails productSeo={categorySeo} />
      ) : (
        <>No any SEO available</>
      )}
    </Container>
  )
}

export default CategorySeoWidget
