import { RouteFocusModal } from "../../../components/modals"
import { OrderCreateForm } from "./components/order-create-form/order-create-form"

type Props = {}

export const OrderCreate = (props: Props) => {
  return (
    <RouteFocusModal>
      <OrderCreateForm />
    </RouteFocusModal>
  )
}
