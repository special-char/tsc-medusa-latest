import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, Textarea, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { HttpTypes } from "@medusajs/types"
import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useupdateVendor } from "../../../../../hooks/api/users"
import SelectCountry from "../../../vendor-create/select-coutry"
import FileUploadField from "../../../../products/product-detail/components/product-seo/components/form/FileUploadField"
import { useRegionsVendor } from "../../../../../hooks/api"
import { Combobox } from "../../../../../components/inputs/combobox"

type EditProfileProps = {
  user: any
  // usageInsights: boolean
}

const EditProfileSchema = zod.object({
  first_name: zod.string().optional(),
  last_name: zod.string().optional(),
  // Vendor specific fields
  logo: zod.any().optional(),
  name: zod.string().optional(),
  category: zod.string().optional(),
  address: zod.string().optional(),
  postal_code: zod.string().optional(),
  city: zod.string().optional(),
  country: zod.string().optional(),
  state: zod.string().optional(),
  // commission: zod.number().min(0).max(100).optional(),
  description: zod.string().optional(),
  regions: zod
    .array(zod.string())
    .min(1, "At least one region must be selected"),
})

export const EditProfileForm = ({ user }: EditProfileProps) => {
  console.log("🚀 ~ EditProfileForm ~ user:", user)
  const { t, i18n } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const isVendor = !!user.vendor_id
  const { regions } = useRegionsVendor()
  const regionOptions =
    regions?.map((region) => ({
      value: region.id,
      label: region.name,
    })) || []
  const form = useForm<zod.infer<typeof EditProfileSchema>>({
    defaultValues: {
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      logo: user?.vendor?.vendor?.logo ?? "",
      category: user?.vendor?.vendor?.category ?? "",
      address: user?.vendor?.vendor?.address ?? "",
      postal_code: user?.vendor?.vendor?.postal_code ?? "",
      city: user?.vendor?.vendor?.city ?? "",
      country: user?.vendor?.vendor?.country ?? "",
      state: user?.vendor?.vendor?.state ?? "",
      // commission: user?.vendor?.vendor?.commission ?? 0,
      description: user?.vendor?.vendor?.description ?? "",
      name: user?.vendor?.vendor?.name ?? "",
      regions: user?.vendor?.region?.map((e) => e.region_id) ?? [],
    },
    resolver: zodResolver(EditProfileSchema),
  })

  const { mutateAsync: vendorMutate, isPending: vendorIsPending } =
    useupdateVendor(user.id!)

  const handleSubmit = form.handleSubmit(async (values) => {
    const userUpdate = {
      first_name: values.first_name,
      last_name: values.last_name,
    }

    const vendorUpdate = {
      first_name: values.first_name,
      last_name: values.last_name,
      ...(values.logo && { logo: values.logo }),
      category: values.category,
      address: values.address,
      postal_code: values.postal_code,
      city: values.city,
      country: values.country,
      state: values.state,
      // commission: values.commission,
      description: values.description,
      name: values.name,
      region: values.regions,
    }

    try {
      await vendorMutate(vendorUpdate)

      toast.success("Merchant updated successfully.")
      handleSuccess("/merchants")
    } catch (error: any) {
      toast.error(error.message)
    }
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body className="flex-1 overflow-y-auto pb-20">
          <div className="flex flex-col gap-y-8 p-6">
            <div className="grid grid-cols-2 gap-4">
              <Form.Field
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>{t("fields.firstName")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>{t("fields.lastName")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />
            </div>

            {isVendor && (
              <>
                <Form.Field
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>{"Company Name"}</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />

                <Form.Field
                  control={form.control}
                  name="logo"
                  render={({ field: { value, onChange, ...field } }) => (
                    <Form.Item>
                      <Form.Label>{"Logo"}</Form.Label>
                      <Form.Control>
                        <FileUploadField
                          {...field}
                          value={value}
                          onChange={onChange}
                          placeholder={t("fields.logoPlaceholder")}
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Form.Field
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>{t("fields.category")}</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )}
                  />
                  <Form.Field
                    control={form.control}
                    name="regions"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>{"Region"}</Form.Label>
                          <Form.Control>
                            <Combobox
                              {...field}
                              options={regionOptions}
                              placeholder="Select a region"
                            />
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                </div>

                <Form.Field
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>{"Address"}</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Form.Field
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>{"Postal Code"}</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )}
                  />
                  <Form.Field
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>{"City"}</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Form.Field
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>{"Country"}</Form.Label>
                        <Form.Control>
                          <SelectCountry {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )}
                  />

                  <Form.Field
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>{"State"}</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )}
                  />
                </div>

                <Form.Field
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>{"Description"}</Form.Label>
                      <Form.Control>
                        <Textarea {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />
              </>
            )}
            {/* TODO: Do we want to implement usage insights in V2? */}
            {/* <Form.Field
              control={form.control}
              name="usage_insights"
              render={({ field: { value, onChange, ...rest } }) => (
                <Form.Item>
                  <div className="flex items-center justify-between">
                    <Form.Label>
                      {t("profile.fields.usageInsightsLabel")}
                    </Form.Label>
                    <Form.Control>
                      <Switch
                        {...rest}
                        checked={value}
                        onCheckedChange={onChange}
                      />
                    </Form.Control>
                  </div>
                  <Form.Hint>
                    <span>
                      <Trans
                        i18nKey="profile.edit.usageInsightsHint"
                        components={[
                          <a
                            key="hint-link"
                            className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-fg underline"
                            // TODO change link once docs are public
                            href="https://medusa-resources-git-docs-v2-medusajs.vercel.app/resources/usage#admin-analytics"
                            target="_blank"
                            rel="noopener noreferrer"
                          />,
                        ]}
                      />
                    </span>
                  </Form.Hint>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            /> */}
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer className="bg-ui-bg-base sticky bottom-0 border-t">
          <div className="flex items-center justify-end gap-x-2 p-4">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={vendorIsPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
