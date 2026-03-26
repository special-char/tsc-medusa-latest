import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import RevalidateChatbotProductsWidget from "../../../widgets/revalidate-chatbot-products"
import RevalidateProductsInStorefrontWidget from "../../../widgets/revalidate-products"
import { ProductListTable } from "./components/product-list-table"

export const ProductList = () => {
  const { getWidgets } = useDashboardExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("product.list.after"),
        before: getWidgets("product.list.before"),
      }}
    >
      <RevalidateProductsInStorefrontWidget />
      <RevalidateChatbotProductsWidget />
      <ProductListTable />
    </SingleColumnPage>
  )
}
