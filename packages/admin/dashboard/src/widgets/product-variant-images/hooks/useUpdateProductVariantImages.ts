import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/client"

type ProductVariantImagesPayload = {
  thumbnail?: string
  images?: string[]
  plpImages?: string[]
  selectedImages?: string[]
}

export function useUpdateProductVariantImages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      variant_id,
      data,
    }: {
      variant_id: string
      data: ProductVariantImagesPayload
    }) =>
      // await sdk.admin.productVariantImages.updateProductVariant(
      //   variant_id,
      //   data
      // ),
      await sdk.client.fetch(
        `/admin/product-variant-images/variant/${variant_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        }
      ),
    onSuccess: () => {
      // Revalidate queries with the specified tag
      void queryClient.invalidateQueries({ queryKey: ["product_variants"] })
    },
  })
}
