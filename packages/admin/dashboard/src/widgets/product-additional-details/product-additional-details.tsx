import { Container, Heading } from "@medusajs/ui"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import ProductAdditionalDetailsForm from "./components/ProductAdditionalDetailsForm"

const ProductAdditionalDetailsWidget = ({
  data,
}: DetailWidgetProps<AdminProduct>) => {
  return (
    <Container className="divide-y p-0 font-sans">
      <Heading level="h2" className="px-6 py-4 font-medium">
        Additional Details - {data.title}
      </Heading>
      <div className="px-6 py-4">
        <ProductAdditionalDetailsForm product={data} />
      </div>
    </Container>
  )
}

export default ProductAdditionalDetailsWidget
