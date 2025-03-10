import { z } from "zod"

export const AddMetadataSchema = z.object({
  display_name: z.string(),
})
export type AddMetadataSchema = z.infer<typeof AddMetadataSchema>
