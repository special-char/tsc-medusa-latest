import { Container, Heading } from "@medusajs/ui"
import { useProductOptions } from "./hooks/useProductOptions"
import ProductOptionsSelection from "./components/product-options-selection"

type ProductOptionImagesWidgetProps = {
  data: {
    id: string
  }
}

const ProductOptionImagesWidget = ({
  data,
}: ProductOptionImagesWidgetProps) => {
  const { isLoading, product_options, error, isError } = useProductOptions(
    data.id,
    {
      fields: "+metadata,*values",
    }
  )

  // if (isLoading || isError) {
  //   return null
  // }

  return (
    <Container className="divide-y p-0 font-sans">
      <Heading level="h2" className="px-6 py-4 font-medium">
        Option Values
      </Heading>
      {product_options ? (
        <ProductOptionsSelection options={product_options} />
      ) : (
        <p>No any option available</p>
      )}
    </Container>
  )
}

export default ProductOptionImagesWidget
