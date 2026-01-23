import { z } from "zod"

export const ProductPromotionalSchema = z.object({
  label_above_image: z.string().optional(),
  promotional_text: z.string().optional(),
})

export type ProductPromotionalSchema = z.infer<typeof ProductPromotionalSchema>
