import { HttpTypes } from "@medusajs/types"
import { Button, Input, Textarea, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import { FormProvider } from "react-hook-form"
import { InlineTip } from "../../../../../components/common/inline-tip"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdateFulfillmentSetServiceZone } from "../../../../../hooks/api/fulfillment-sets"
import PackagingAndForwording from "../../../location-detail/components/packaging-forwording"


type EditServiceZoneFormProps = {
  zone: HttpTypes.AdminServiceZone & {
    metadata: Record<string, any>
  }
  fulfillmentSetId: string
  locationId: string
}

const EditServiceZoneSchema = zod.object({
  name: zod.string().min(1),
  metadata: zod.object({
    fixed: zod.record(zod.string(), zod.string().or(zod.number())).optional(),
    per_kg: zod.record(zod.string(), zod.string().or(zod.number())).optional(),
    description: zod.string().optional(),
  }).optional(),
})

export const EditServiceZoneForm = ({
  zone,
  fulfillmentSetId,
  locationId,
}: EditServiceZoneFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditServiceZoneSchema>>({
    defaultValues: {
      name: zone.name,
      metadata: {
        fixed: zone?.metadata?.fixed || {},
        per_kg: zone?.metadata?.per_kg || {},
        description: zone?.metadata?.description,
      },
    },
  })

  const { mutateAsync, isPending: isLoading } =
    useUpdateFulfillmentSetServiceZone(fulfillmentSetId, zone.id)

  const handleSubmit = form.handleSubmit(async (values) => {

    await mutateAsync(
      {
        name: values.name,
        metadata: values.metadata,
      },
      {
        onSuccess: () => {
          toast.success(
            t("stockLocations.serviceZones.edit.successToast", {
              name: values.name,
            })
          )
          handleSuccess(`/settings/locations/${locationId}`)
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <FormProvider {...form}>
        <KeyboundForm
          onSubmit={handleSubmit}
          className="flex size-full flex-col overflow-hidden"
        >
          <RouteDrawer.Body className="flex-1 overflow-auto">
            <>
              <div className="flex flex-col gap-y-8">
                <div className="flex flex-col gap-y-4">
                  <Form.Field
                    control={form.control}
                    name="name"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>{t("fields.name")}</Form.Label>
                          <Form.Control>
                            <Input {...field} />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                </div>
                <Form.Field
                  control={form.control}
                  name="metadata.description"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.description")}</Form.Label>
                        <Form.Control>
                          <Textarea {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <InlineTip>{t("stockLocations.serviceZones.fields.tip")}</InlineTip>
              </div>

              <PackagingAndForwording
                title="Fixed"
                metaKeys={[
                  "0kg-50kg",
                  "50kg-100kg",
                  "100kg-1000kg"
                ]}
                name="metadata.fixed"
              />
              <PackagingAndForwording
                title="Per Kg"
                metaKeys={[
                  "0kg-20kg",
                  "20kg-100kg",
                  "100kg-1000kg"
                ]}
                name="metadata.per_kg"
              />
            </>
          </RouteDrawer.Body>
          <RouteDrawer.Footer>
            <div className="flex items-center gap-x-2">
              <RouteDrawer.Close asChild>
                <Button size="small" variant="secondary">
                  {t("actions.cancel")}
                </Button>
              </RouteDrawer.Close>
              <Button size="small" type="submit" isLoading={isLoading}>
                {t("actions.save")}
              </Button>
            </div>
          </RouteDrawer.Footer>
        </KeyboundForm>
      </FormProvider>
    </RouteDrawer.Form>
  )
}
