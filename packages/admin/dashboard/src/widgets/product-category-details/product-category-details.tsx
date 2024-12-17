import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading } from "@medusajs/ui"
import {
  DetailWidgetProps,
  AdminProductCategory,
} from "@medusajs/framework/types"
import ProductCategoryDetailsForm from "./components/ProductCategoryDetailsForm"

const ProductCategoryWidget = ({
  data,
}: DetailWidgetProps<AdminProductCategory>) => {
  return (
    <Container className="p-0 divide-y">
      <Heading level="h2" className="font-sans font-medium h2-core px-6 py-4">
        Additional Data for Category - {data.name}
      </Heading>

      <div className="px-6 py-4">
        <ProductCategoryDetailsForm category={data} />
      </div>
    </Container>
  )
}

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product_category.details.after",
})

export default ProductCategoryWidget
