import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { sdk } from "../../../../lib/client"
import { getSalesChannelIds } from "../../../../const/get-sales-channel"

const deleteBrand = async (brandId: string) => {
  try {
    const response = await sdk.admin.brand.delete(brandId)

    const res = response
    return res
  } catch (error) {
    throw error
  }
}

const handleDeleteBrand = async (
  brandId: string,
  setBrands?: (brands: any[]) => void | null,
  setBrand?: (brand: any) => void | null
): Promise<void> => {
  try {
    const res = await deleteBrand(brandId)
    // toast.success(`Brand ${brandId}`)
    toast.success("Brand deleted successfully")
    if (setBrands) {
      try {
        const queryString = new URLSearchParams()
        const salesChannelIds = getSalesChannelIds()
        // Iterate over the searchParams object to build the query string

        salesChannelIds && salesChannelIds[0] && salesChannelIds[0].length != 0
          ? queryString.append("sales_channel", salesChannelIds[0].toString())
          : null

        // Convert searchParams to query string

        const response = await sdk.admin.brand.list(queryString)
        if (!response) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to fetch brands")
        }
        const result = response
        setBrands(result.brands) // Return the brands array
      } catch (error) {
        console.error(error)
        throw error // Rethrow the error for handling in the component
      }
    }
    if (setBrand) {
      setBrand(null)
    }
    // Optionally, you can handle navigation or state updates here
  } catch (error: any) {
    toast.error(error?.message || "Failed to delete brand. Please try again.")
  }
}

export const useDeleteBrandAction = (
  id: string,
  name: string,
  setBrands?: (brands: any[]) => void | null,
  setBrand?: (brand: any) => void | null
) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const handleDelete = async () => {
    const result = await prompt({
      title: t("general.areYouSure"),
      description: `You are about to delete the product type ${name}. This action cannot be undone.`,
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }
    await handleDeleteBrand(id, setBrands, setBrand)
  }

  return handleDelete
}
