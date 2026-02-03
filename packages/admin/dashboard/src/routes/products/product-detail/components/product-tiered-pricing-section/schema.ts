import { z } from "zod"

export const TierSchema = z
  .object({
    amount: z.number().positive("Price must be positive"),
    min_quantity: z
      .number()
      .int()
      .min(1, "Min quantity must be at least 1")
      .optional()
      .nullable(),
    max_quantity: z.number().int().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.min_quantity && data.max_quantity) {
        return data.min_quantity <= data.max_quantity
      }
      return true
    },
    {
      message: "Min quantity must be less than or equal to max quantity",
      path: ["min_quantity"],
    }
  )

export type TierSchemaType = z.infer<typeof TierSchema>
