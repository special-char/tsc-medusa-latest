import { AdminProductVariant } from "@medusajs/framework/types"

export type VariantImageType = {
  id: string
  images: string[]
  thumbnail: string
  plpImages: string[]
  selectedImages: string[]
}

export type CustomProductVariantType = AdminProductVariant & {
  product_variant_images?: VariantImageType
}

export type Media = {
  id: string
  url: string
  isThumbnail: boolean
  isSelected: boolean
}
