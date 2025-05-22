import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { ProductListTable } from "./components/product-list-table"
import SyncPrice from "./components/sync-price"

export const ProductList = () => {
  const { getWidgets } = useDashboardExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("product.list.after"),
        before: getWidgets("product.list.before"),
      }}
    >
      <SyncPrice />
      <ProductListTable />
    </SingleColumnPage>
  )
}
