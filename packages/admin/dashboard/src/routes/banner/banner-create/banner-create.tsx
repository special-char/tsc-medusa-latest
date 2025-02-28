import { FieldValues } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "@medusajs/ui"
import { sdk } from "../../../lib/client"
import { BannerForm } from "../banner-form/banner-form"
import { BannerProps } from "../banner-list/components/banner-list-table"

export const BannerCreate = () => {
  const navigate = useNavigate()
  const onSubmit = async (data: FieldValues) => {
    try {
      const createBannerData = {
        name: data.name,
        link: data.link,
        image: data.image,
        text: data.text,
      }

      const createBannerResponse = (await sdk.admin.banner.create(
        createBannerData
      )) as BannerProps
      navigate("/banner")
      navigate(0)
    } catch (error: any) {
      toast.error("Failed to Create Banner", {
        description: error.message,
        duration: 5000,
      })
      console.error(`failed to create banner : ${error.message}`)
    }
  }

  return (
    <BannerForm
      onSubmit={
        onSubmit as (data: FieldValues) => Promise<BannerProps | undefined>
      }
      isEditMode={false}
    />
  )
}
