import { HttpTypes } from "@medusajs/types"
import { Button, Container, Heading, toast, Alert } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateProductVariant, useProduct } from "../../../../../hooks/api"
import { VariantDraftSchema } from "./schema"
import CustomToggleButton from "../../../../../components/custom/components/form/CustomToggleButton"

type VariantGeneralSectionProps = {
  variant: HttpTypes.AdminProductVariant
}

export function VariantDraftSection({ variant }: VariantGeneralSectionProps) {
  const { t } = useTranslation()

  // Fetch product metadata to check if this is the default variant
  const { product } = useProduct(variant.product_id!, {
    fields: "metadata",
  })

  // Check if this variant is the default variant
  const isDefaultVariant = product?.metadata?.default_variant === variant.id

  const form = useForm<VariantDraftSchema>({
    defaultValues: {
      isDraft: (variant?.metadata?.isDraft as boolean) || false,
    },
    resolver: zodResolver(VariantDraftSchema),
  })

  const { mutateAsync, isPending } = useUpdateProductVariant(
    variant.product_id!,
    variant.id
  )

  const handleSubmit = form.handleSubmit((data) => {
    const { isDraft } = data

    mutateAsync(
      {
        metadata: {
          ...variant?.metadata,
          isDraft,
        },
      },
      {
        onSuccess: () => {
          toast.success(t("products.variant.edit.success"))
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center gap-2 px-6 py-4">
        <Heading level="h2">Variant Draft</Heading>
      </div>

      <div className="px-6 py-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {/* <Label>is Draft</Label> */}

            {isDefaultVariant ? (
              <Alert variant="warning">
                You cannot set the default variant to draft
              </Alert>
            ) : (
              <Controller
                name="isDraft"
                control={form.control}
                render={({ field }) => (
                  <CustomToggleButton
                    {...field}
                    onChange={(e) => field.onChange(e.target.checked)}
                    value={field.value}
                  />
                )}
              />
            )}
          </div>
          {!isDefaultVariant && (
            <div className="flex gap-4 self-end">
              <Button
                size="small"
                type="submit"
                isLoading={isPending}
                disabled={isPending || !form.formState.isDirty}
              >
                Submit
              </Button>
            </div>
          )}
        </form>
      </div>
    </Container>
  )
}
