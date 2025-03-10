import { Button, Container, Input, Label, toast } from "@medusajs/ui"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateProductCategory } from "../../../../../hooks/api"
import { AddMetadataSchema } from "./schema"
import { AdminProductCategory } from "@medusajs/types"
import { useTranslation } from "react-i18next"

export const CategoryDisplayName = ({
  category,
}: {
  category: AdminProductCategory
}) => {
  const { t } = useTranslation()

  const form = useForm<AddMetadataSchema>({
    defaultValues: {
      display_name: (category?.metadata?.display_name || "") as string,
    },
    resolver: zodResolver(AddMetadataSchema),
  })

  const { mutateAsync, isPending } = useUpdateProductCategory(category.id)

  const handleSubmit = form.handleSubmit((data) => {
    const { display_name } = data

    mutateAsync(
      {
        metadata: {
          ...category?.metadata,
          display_name: display_name,
        },
      },
      {
        onSuccess: () => {
          toast.success(t("categories.edit.successToast"))
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })
  return (
    <Container>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Controller
          name="display_name"
          control={form.control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input {...field} />
            </div>
          )}
        />

        <Button
          size="small"
          type="submit"
          isLoading={isPending}
          className="self-end"
        >
          Submit
        </Button>
      </form>
    </Container>
  )
}
