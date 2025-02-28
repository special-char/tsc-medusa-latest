import { FieldValues } from "react-hook-form"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { sdk } from "../../../lib/client"
import { toast } from "@medusajs/ui"
import { BannerProps } from "../banner-list/components/banner-list-table"
import { BannerForm } from "../banner-form/banner-form"

export const BannerEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()

  const onSubmit = async (data: FieldValues) => {
    try {
      const updateBannerData = {
        name: data.name,
        link: data.link,
        image: data.image,
        text: data.text,
        isActive: data.isActive,
      }
      console.log(updateBannerData, "geeee")

      const updateBannerResponse = (await sdk.admin.banner.update(
        id!,
        updateBannerData
      )) as BannerProps
      navigate("/banner")
      navigate(0)
      return updateBannerResponse
    } catch (error: any) {
      toast.error("Failed to Update Banner", {
        description: error.message,
        duration: 5000,
      })
      console.error(`failed to Update banner : ${error.message}`)
    }
  }

  return (
    <BannerForm initialData={state} onSubmit={onSubmit} isEditMode={true} />
  )
}
