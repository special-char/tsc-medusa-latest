import { z } from "zod"

export const ProductCardSchema = z.object({
  display_title: z.string().optional(),
  short_description: z.string().optional(),
})

export type ProductCardSchema = z.infer<typeof ProductCardSchema>
