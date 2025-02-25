import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading } from "@medusajs/ui"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import ProductHighlightForm from "./components/ProductHighlightForm"

const ProductHighlightWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  return (
    <Container className="divide-y p-0">
      <Heading level="h2" className="h2-core px-6 py-4 font-sans font-medium">
        Highlights - {data.title}
      </Heading>

      <div className="px-6 py-4">
        <ProductHighlightForm product={data} />
      </div>
    </Container>
  )
}

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product_category.details.after",
})

export default ProductHighlightWidget
