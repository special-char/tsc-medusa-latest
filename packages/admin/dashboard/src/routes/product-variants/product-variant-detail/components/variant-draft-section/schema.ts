import { z } from "zod"

export const VariantDraftSchema = z.object({
  isDraft: z.boolean().default(false),
})
export type VariantDraftSchema = z.infer<typeof VariantDraftSchema>
