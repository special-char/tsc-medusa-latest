import { PencilSquare, Trash } from "@medusajs/icons"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { NotificationTemplate } from "./notification-template-list-table"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../../../../lib/client"

type NotificationTemplateRowActionsProps = {
  notificationTemplate: NotificationTemplate
}

export const NotificationTemplateRowActions = ({
  notificationTemplate,
}: NotificationTemplateRowActionsProps) => {
  const { t } = useTranslation()
  const navigation = useNavigate()
  const handleDelete = async () => {
    await sdk.admin.notificationTemplate.delete(
      notificationTemplate?.id as string
    )
    navigation(0)
  }
  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              icon: <PencilSquare />,
              // to: `/settings/notification-template/${notificationTemplate.id}/edit`,
              onClick: () => {
                navigation(`/settings/notification-template/edit`, {
                  state: notificationTemplate,
                })
              },
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
