import z from "zod"

export const MediaSchema = z.object({
  id: z.string().optional(),
  url: z.string(),
  isThumbnail: z.boolean(),
  isSelected: z.boolean(),
  isPlp: z.boolean(),
  file: z.any().nullable(), // File
  isDeleted: z.boolean().optional(),
})

export const EditProductMediaSchema = z.object({
  variant_media: z.array(MediaSchema),
})

export type EditProductMediaSchemaType = z.infer<typeof EditProductMediaSchema>
