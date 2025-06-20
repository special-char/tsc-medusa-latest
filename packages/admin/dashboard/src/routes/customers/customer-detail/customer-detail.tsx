import { useLoaderData, useParams, useOutlet } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { useCustomer } from "../../../hooks/api/customers"
import { CustomerGeneralSection } from "./components/customer-general-section"
import { CustomerGroupSection } from "./components/customer-group-section"
import { CustomerOrderSection } from "./components/customer-order-section"
import { customerLoader } from "./loader"
import CustomerAddressesWidget from "../../../widgets/customer-addresses/customer-addresses"
import { TinyErpOrdersSection } from "./components/tiny-erp-customer-orders.tsx/tiny-erp-orders-section"

export const CustomerDetail = () => {
  const { id } = useParams()
  const outlet = useOutlet()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof customerLoader>
  >
  const { customer, isLoading, isError, error } = useCustomer(id!, undefined, {
    initialData,
  })

  const { getWidgets } = useDashboardExtension()

  if (isLoading || !customer) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  // If a child route is matched, render only the outlet (e.g., Tiny ERP order detail page)
  if (outlet) {
    return outlet
  }

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("customer.details.before"),
        after: getWidgets("customer.details.after"),
      }}
      data={customer}
      hasOutlet
      showJSON
      showMetadata
    >
      <CustomerGeneralSection customer={customer} />
      <CustomerOrderSection customer={customer} />
      <TinyErpOrdersSection customer={customer} />
      <CustomerGroupSection customer={customer} />
      <CustomerAddressesWidget customer={customer} />
    </SingleColumnPage>
  )
}
