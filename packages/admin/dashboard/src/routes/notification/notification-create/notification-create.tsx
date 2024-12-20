import { RouteFocusModal } from "../../../components/modals"
import { CreateNotificationForm } from "./components/notification-create-form"

export const NotificationCreate = () => {
  return (
    <RouteFocusModal>
      <CreateNotificationForm />
    </RouteFocusModal>
  )
}
