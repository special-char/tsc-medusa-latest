import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { Brand } from "../../../brand-list/components/brand-list-table/brand-list-table"
import { useState } from "react"

const EditBrandSchema = z.object({
  name: z.string().min(1),
})

type EditBrandFormProps = {
  Brand: Brand
}

const editBrand = async (data: { name: string; id: string }) => {
  try {
    const response = await fetch(`${__BACKEND_URL__}/admin/brand/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // "x-publishable-api-key": __PUBLISHABLE_KEY__,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create brand")
    }

    const res = await response.json()
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const EditBrandForm = ({ Brand }: EditBrandFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<z.infer<typeof EditBrandSchema>>({
    defaultValues: {
      name: Brand.name,
    },
    resolver: zodResolver(EditBrandSchema),
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsPending(true)
    try {
      await editBrand({
        name: data.name,
        id: Brand.id,
      })
      toast.success("Brand updated successfully")
      handleSuccess(`/settings/brand`)
    } catch (error) {
      toast.error("Failed to update brand")
    } finally {
      setIsPending(false)
    }
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-y-auto">
          <Form.Field
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{field.name}</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
