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
    <Container className="divide-y p-0">
      <Heading level="h2" className="h2-core px-6 py-4 font-sans font-medium">
        Additional Data for Category - {data.name}
      </Heading>

      <div className="px-6 py-4">
        <ProductCategoryDetailsForm category={data} />
      </div>
    </Container>
  )
}

export default ProductCategoryWidget
