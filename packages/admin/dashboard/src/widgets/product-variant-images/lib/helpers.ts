import { CustomProductVariantType, VariantImageType } from "../types"
import { MediaSchema } from "./constants"
import z from "zod"

export const getVariantMedia = (variant: CustomProductVariantType) => {
  const { product_variant_images } = variant
  if (product_variant_images) {
    const { images, selectedImages, plpImages, thumbnail } =
      product_variant_images

    const media: Media[] =
      images?.map((image) => ({
        id: image,
        url: image,
        isThumbnail: image === thumbnail,
        isSelected: selectedImages?.includes(image) ?? false,
        isPlp: plpImages?.includes(image) ?? false,
      })) || []

    // if (thumbnail && !media.some((mediaItem) => mediaItem.url === thumbnail)) {
    // 	media.unshift({
    // 		id: "img_thumbnail",
    // 		url: thumbnail,
    // 		isThumbnail: true,
    // 		isSelected: selectedImages?.includes(thumbnail) ?? false,
    // 		isPlp: plpImages?.includes(thumbnail) ?? false,
    // 	});
    // }
    media.sort((a, b) => {
      if (a.isThumbnail !== b.isThumbnail) {
        return b.isThumbnail ? 1 : -1
      }
      // if (a.isPlp !== b.isPlp) return b.isPlp ? 1 : -1;
      return 0
    })

    return media
  }
  return []
}

type Media = z.infer<typeof MediaSchema>

export const getDefaultValues = ({
  images,
  thumbnail,
  selectedImages,
  plpImages,
}: Omit<VariantImageType, "id">) => {
  const media: Media[] =
    images?.map((image) => ({
      id: image,
      url: image,
      isThumbnail: image === thumbnail,
      isSelected: selectedImages?.includes(image) ?? false,
      isPlp: plpImages?.includes(image) ?? false,
      file: null,
    })) || []

  // if (thumbnail && !media.some((mediaItem) => mediaItem.url === thumbnail)) {
  // 	const id = Math.random().toString(36).substring(7);

  // 	media.unshift({
  // 		id: id,
  // 		url: thumbnail,
  // 		isThumbnail: true,
  // 		isSelected: false,
  // 		file: null,
  // 	});
  // }
  media.sort((a, b) => {
    if (a.isThumbnail !== b.isThumbnail) {
      return b.isThumbnail ? 1 : -1
    }
    // if (a.isPlp !== b.isPlp) return b.isPlp ? 1 : -1;
    return 0
  })

  return media
}
