import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

const deleteBrand = async (brandId: string) => {
  try {
    const response = await fetch(`${__BACKEND_URL__}/admin/brand/${brandId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // "x-publishable-api-key": __PUBLISHABLE_KEY__,
      },
    })

    if (!response.ok) {
      // Throw an error if the response status is not OK
      const errorData = await response.json()

      throw new Error(errorData.error || "Failed to delete brand")
    }

    const res = await response.json()
    return res
  } catch (error) {
    console.log(error)
    throw error // Rethrow the error to be caught in handleSubmit
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
      setBrands(res.brand)
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
