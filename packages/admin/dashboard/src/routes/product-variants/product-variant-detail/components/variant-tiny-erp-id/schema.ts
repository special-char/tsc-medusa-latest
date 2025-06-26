import { z } from "zod"

export const VariantTinyErpIdSchema = z.object({
  tiny_erp_product_id: z.string(),
})
export type VariantTinyErpIdSchema = z.infer<typeof VariantTinyErpIdSchema>
