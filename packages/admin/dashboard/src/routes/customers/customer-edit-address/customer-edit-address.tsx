import { Heading } from "@medusajs/ui"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { useCustomer } from "../../../hooks/api/customers"
import { EditCustomerAddressForm } from "./components/edit-address-form/edit-address-form"

export const CustomerEditAddress = () => {
  const { id } = useParams()
  const { customer, isLoading, isError, error } = useCustomer(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>Edit Address</Heading>
      </RouteDrawer.Header>
      {!isLoading && customer && (
        <EditCustomerAddressForm customer={customer} address_id={id!} />
      )}
    </RouteDrawer>
  )
}
