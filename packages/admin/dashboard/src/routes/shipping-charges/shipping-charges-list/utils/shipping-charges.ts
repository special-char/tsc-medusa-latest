import { ShippingChargeData } from "../components"
import { sdk } from "../../../../lib/client"

export const submitShippingCharges = async (shippingCharges: ShippingChargeData[]) => {
  try {
    await sdk.admin.shippingCharges.create(shippingCharges)
  } catch (error) {
    console.error("Error submitting shipping charges:", error)
    throw error
  }
}

export const deleteShippingCharges = async () => {
  try {
    await sdk.admin.shippingCharges.delete()
  } catch (error) {
    console.error("Error deleting shipping charges:", error)
    throw error
  }
}

export const getShippingCharges = async () => {
  try {
    const response = await sdk.admin.shippingCharges.get()
    return response
  } catch (error) {
    console.error("Error getting shipping charges:", error)
    throw error
  }
}