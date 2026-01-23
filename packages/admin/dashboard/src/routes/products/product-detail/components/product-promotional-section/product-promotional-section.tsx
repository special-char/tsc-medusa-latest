import { HttpTypes } from "@medusajs/types"
import { Button, Container, Heading, Input, Label, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Controller, useForm } from "react-hook-form"
import { ProductPromotionalSchema } from "./schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateProduct } from "../../../../../hooks/api"

type ProductPromotionalSectionProps = {
  product: HttpTypes.AdminProduct
}

export function ProductPromotionalSection({
  product,
}: ProductPromotionalSectionProps) {
  const { t } = useTranslation()

  const form = useForm<ProductPromotionalSchema>({
    defaultValues: {
      label_above_image: (product?.metadata?.label_above_image || "") as string,
      promotional_text: (product?.metadata?.promotional_text || "") as string,
    },
    resolver: zodResolver(ProductPromotionalSchema),
  })

  const { mutateAsync, isPending } = useUpdateProduct(product.id)

  const handleSubmit = form.handleSubmit((data) => {
    const { label_above_image, promotional_text } = data

    mutateAsync(
      {
        metadata: {
          ...product?.metadata,
          label_above_image: label_above_image,
          promotional_text: promotional_text,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            t("products.edit.successToast", { title: product.title })
          )
          form.reset(data)
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
        <Heading level="h2">Promotional Content</Heading>
      </div>

      <div className="px-6 py-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Controller
            name="label_above_image"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Promotional Tag</Label>
                <Input {...field} placeholder="e.g., +200 sold" />
              </div>
            )}
          />

          <Controller
            name="promotional_text"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Promotional Text</Label>
                <Input
                  {...field}
                  placeholder="e.g., Over 3900 purchases last month"
                />
              </div>
            )}
          />

          <div className="flex gap-4 self-end">
            <Button
              size="small"
              type="submit"
              isLoading={isPending}
              disabled={!form.formState.isDirty}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </Container>
  )
}
