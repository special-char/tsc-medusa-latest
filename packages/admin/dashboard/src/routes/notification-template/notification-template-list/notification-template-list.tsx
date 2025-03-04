import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { NotificationTemplateListTable } from "./components/notification-template-list-table/notification-template-list-table"
export const NotificationList = () => {
  const { getWidgets } = useDashboardExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("product_type.list.after"),
        before: getWidgets("product_type.list.before"),
      }}
    >
      <NotificationTemplateListTable />
    </SingleColumnPage>
  )
}
