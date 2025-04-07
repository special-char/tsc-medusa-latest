import { useParams } from "react-router-dom"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { usePendingOrder } from "../hooks/usePendingOrder"
import { PendingOrderGeneralSection } from "./components/pending-order-general-section"
import { PendingOrderSummarySection } from "./components/pending-order-summary-section"
import { PendingOrderCustomerSection } from "./components/pending-order-customer-section"
import { PendingOrderPaymentSection } from "./components/pending-order-payment-section"

export const PendingOrderDetail = () => {
  const { id } = useParams()

  const { cart, isLoading, isError, error } = usePendingOrder(id!)

  // TODO: Retrieve endpoints don't have an order ability, so a JS sort until this is available
  if (cart) {
    cart.items = cart.items.sort((itemA: any, itemB: any) => {
      if (itemA.created_at > itemB.created_at) {
        return 1
      }

      if (itemA.created_at < itemB.created_at) {
        return -1
      }

      return 0
    })
  }

  if (isLoading || !cart) {
    return (
      <TwoColumnPageSkeleton mainSections={4} sidebarSections={2} showJSON />
    )
  }

  if (isError) {
    throw error
  }

  return (
    <>
      <div className="flex w-full flex-col gap-y-3">
        <div className="flex w-full flex-col items-start gap-x-4 gap-y-3 xl:grid xl:grid-cols-[minmax(0,_1fr)_440px]">
          <div className="flex w-full min-w-0 flex-col gap-y-3">
            <PendingOrderGeneralSection cart={cart} />
            <PendingOrderSummarySection cart={cart} />
            <PendingOrderPaymentSection cart={cart} />
          </div>
          <div className="flex w-full flex-col gap-y-3 xl:mt-0">
            <PendingOrderCustomerSection cart={cart} />
          </div>
        </div>
      </div>
    </>
  )
}
