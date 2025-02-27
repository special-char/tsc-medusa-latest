import { PencilSquare, Trash } from "@medusajs/icons"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteNotificationTemplateAction } from "../../../common/hooks/use-delete-notification-template-action"
import { NotificationTemplate } from "./notification-template-list-table"

type NotificationTemplateRowActionsProps = {
  notificationTemplate: NotificationTemplate
  setNotificationTemplates: (notificationTemplates: any[]) => void
}

export const NotificationTemplateRowActions = ({
  notificationTemplate,
  setNotificationTemplates,
}: NotificationTemplateRowActionsProps) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteNotificationTemplateAction(
    notificationTemplate.id,
    setNotificationTemplates
  )

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              icon: <PencilSquare />,
              to: `/settings/notification-template/${notificationTemplate.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              label: t("actions.delete"),
              icon: <Trash />,
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}
