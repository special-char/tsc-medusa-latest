import { Container, Heading } from "@medusajs/ui"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import ProductAdditionalDetailsForm from "./components/ProductAdditionalDetailsForm"

const ProductAdditionalDetailsWidget = ({
  data,
}: DetailWidgetProps<AdminProduct>) => {
  return (
    <Container className="divide-y-6">
      <Heading level="h2" className="text-xlarge font-bold line-clamp-1">
        Additional Details - {data.title}
      </Heading>
      <ProductAdditionalDetailsForm product={data} />
    </Container>
  )
}

export default ProductAdditionalDetailsWidget
