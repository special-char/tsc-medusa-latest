import { useParams } from "react-router-dom"
import { TwoColumnPage } from "../../components/layout/pages/two-column-page"
import { useTinyErpOrder } from "../customers/customer-detail/hooks/useTinyErpOrders"
import { TinyErpOrderGeneralSection } from "./components/TinyErpOrderGeneralSection"
import { TinyErpOrderItemsSection } from "./components/TinyErpOrderItemsSection"
import { TinyErpOrderPaymentSection } from "./components/TinyErpOrderPaymentSection"
import { TinyErpOrderCustomerSection } from "./components/TinyErpOrderCustomerSection"

const TinyErpOrderDetail = () => {
  const { orderId } = useParams()
  const { data, isLoading, error } = useTinyErpOrder(orderId)

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }
  if (!data?.retorno?.pedido) {
    return <div>Order not found</div>
  }

  const order = data.retorno.pedido
  const customer = order.cliente

  return (
    <TwoColumnPage
      widgets={{ before: [], after: [], sideBefore: [], sideAfter: [] }}
      data={order}
      showJSON={false}
      showMetadata={false}
      hasOutlet={false}
    >
      <TwoColumnPage.Main>
        <TinyErpOrderGeneralSection order={order} />
        <TinyErpOrderItemsSection order={order} />
        <TinyErpOrderPaymentSection order={order} />
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <TinyErpOrderCustomerSection customer={customer} />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}

export default TinyErpOrderDetail
export const Component = TinyErpOrderDetail
