import { HttpTypes } from "@medusajs/types"
import { Button, Container, Heading, Input, Label, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Controller, useForm } from "react-hook-form"
import { ProductCardSchema } from "./schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateProduct } from "../../../../../hooks/api"

type ProductCardSectionProps = {
  product: HttpTypes.AdminProduct
}

export function ProductCardSection({ product }: ProductCardSectionProps) {
  const { t } = useTranslation()

  const form = useForm<ProductCardSchema>({
    defaultValues: {
      display_title: (product?.metadata?.display_title || "") as string,
      short_description: (product?.metadata?.short_description || "") as string,
    },
    resolver: zodResolver(ProductCardSchema),
  })

  const { mutateAsync, isPending } = useUpdateProduct(product.id)

  const handleSubmit = form.handleSubmit((data) => {
    const { display_title, short_description } = data

    mutateAsync(
      {
        metadata: {
          ...product?.metadata,
          display_title: display_title,
          short_description: short_description,
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
        <Heading level="h2">Product Card Content</Heading>
      </div>

      <div className="px-6 py-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Controller
            name="display_title"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Display Title</Label>
                <Input {...field} placeholder="e.g., Summer Collection" />
              </div>
            )}
          />

          <Controller
            name="short_description"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Short Description</Label>
                <Input {...field} placeholder="e.g., Breathable cotton shirt" />
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
