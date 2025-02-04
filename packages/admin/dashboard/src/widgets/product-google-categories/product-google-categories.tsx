import { Container, Heading } from "@medusajs/ui"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import ProductGoogleCategoryForm from "./components/ProductGoogleCategoryForm"

const ProductGoogleCategoryWidget = ({
  data,
}: DetailWidgetProps<AdminProduct>) => {
  return (
    <Container className="divide-y p-0 font-sans">
      <Heading level="h2" className="px-6 py-4 font-medium">
        Google Category - {data.title}
      </Heading>
      <div className="px-6 py-4">
        <ProductGoogleCategoryForm product={data} />
      </div>
    </Container>
  )
}

export default ProductGoogleCategoryWidget
