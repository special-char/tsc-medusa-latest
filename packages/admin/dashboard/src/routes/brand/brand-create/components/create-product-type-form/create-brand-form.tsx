import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"

const CreateProductTypeSchema = z.object({
  value: z.string().min(1),
})

const createBrand = async (data: { name: string }) => {
  try {
    const response = await fetch(`${__BACKEND_URL__}/admin/brand`, {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create brand")
    }

    const res = await response.json()
    return res
  } catch (error) {
    console.log(error)
    throw error // Rethrow the error to be caught in handleSubmit
  }
}

export const CreateProductTypeForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreateProductTypeSchema>>({
    defaultValues: {
      value: "",
    },
    resolver: zodResolver(CreateProductTypeSchema),
  })

  const handleSubmit = form.handleSubmit(
    async (values: z.infer<typeof CreateProductTypeSchema>) => {
      try {
        const createdBrand = await createBrand({ name: values?.value })
        toast.success("Brand created successfully")
        handleSuccess(`/settings/brand/${createdBrand.brand.id}`)
      } catch (error: any) {
        toast.error(
          error?.message || "Failed to create brand. Please try again."
        )
      }
    }
  )

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              size="small"
              variant="primary"
              type="submit"
              // isLoading={isPending}
            >
              {t("actions.create")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-col items-center overflow-y-auto p-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div>
              <Heading>{"Create Brand"}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                Create a new Brand to categorize your products
              </Text>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Form.Field
                control={form.control}
                name="value"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("productTypes.fields.value")}</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </div>
        </RouteFocusModal.Body>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
