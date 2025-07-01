import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/client"

type ProductVariantImagesPayload = {
  color1?: string
  color2?: string
  thumbnailUrl?: string
}

export function useUpdateProductVariantImages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      option_values_id,
      data,
    }: {
      option_values_id: string
      data: ProductVariantImagesPayload
    }) =>
      // await sdk.admin.productVariantImages.updateProductVariant(
      //   variant_id,
      //   data
      // ),
      await sdk.admin.productOptionValue.createOptionValue(option_values_id, {
        metadata: {
          color1: data?.color1 || null,
          color2: data?.color2 || null,
          thumbnail: data?.thumbnailUrl ? data?.thumbnailUrl : null,
        },
      }),
    onSuccess: () => {
      // Revalidate queries with the specified tag
      void queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
