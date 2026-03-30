import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import RevalidateCategoriesInStorefrontWidget from "../../../widgets/revalidate-categories"
import { CategoryListTable } from "./components/category-list-table"

export const CategoryList = () => {
  const { getWidgets } = useDashboardExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("product_category.list.after"),
        before: getWidgets("product_category.list.before"),
      }}
      hasOutlet
    >
      <RevalidateCategoriesInStorefrontWidget />
      <CategoryListTable />
    </SingleColumnPage>
  )
}
