import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { useLocation } from "react-router-dom"
import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCreateCustomer } from "../../../../../hooks/api/customers"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../lib/client"
import { Combobox } from "../../../../../components/inputs/combobox"
import { useAddCustomersToGroup } from "../../../../../hooks/api"

const CreateCustomerSchema = zod.object({
  email: zod.string().email(),
  first_name: zod.string().optional(),
  last_name: zod.string().optional(),
  company_name: zod.string().optional(),
  phone: zod.string().optional(),
  role_id: zod.string().optional(),
})

export const CreateCustomerForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const location = useLocation()
  const { mutateAsync, isPending } = useCreateCustomer()
  const roles = useComboboxData({
    queryKey: ["role"],
    queryFn: (_) => sdk.admin.role.list(),
    getOptions: (data) =>
      data[0]?.map((role) => ({
        label: role.name!,
        value: role.id!,
      })),
  })
  const match: RegExpMatchArray | null = location.pathname.match(
    /client-groups\/([^\/]+)\/add-client/
  )

  const id: string | null = match?.[1] || null

  const { mutateAsync: mutateAsyncAddCustomer } = id
    ? useAddCustomersToGroup(id)
    : { mutateAsync: undefined }

  const handleCustomerAddition = async (customer) => {
    if (location.pathname.includes("/client-group")) {
      await mutateAsyncAddCustomer([customer.id]) 
      handleSuccess(`${location.pathname.replace("/add-client", "")}`)
    } else {
      handleSuccess(`/clients/${customer.id}`)
    }
  }
  const form = useForm<zod.infer<typeof CreateCustomerSchema>>({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      company_name: "",
      role_id: "",
    },
    resolver: zodResolver(CreateCustomerSchema),
  })
  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        email: data.email,
        first_name: data.first_name || undefined,
        last_name: data.last_name || undefined,
        company_name: data.company_name || undefined,
        phone: data.phone || undefined,
        metadata: { role_id: data.role_id },
      },
      {
        onSuccess: ({ customer }) => {
          toast.success(
            t("customers.create.successToast", {
              email: customer.email,
            })
          )

          // if (location.pathname.includes("/client-group")) {

          //   handleSuccess(`${location.pathname.replace("/add-client", "")}`)
          // } else {
          //   handleSuccess(`/clients/${customer.id}`)
          // }
          handleCustomerAddition(customer)
        },
        onError: (error) => {
          if (error.message.includes("Customer")) {
            toast.error(error.message.replace("Customer", "Client"))
            return
          }
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex flex-1 flex-col items-center overflow-y-auto py-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div>
              <Heading>{t("customers.create.header")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("customers.create.hint")}
              </Text>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Form.Field
                control={form.control}
                name="first_name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>{t("fields.firstName")}</Form.Label>
                      <Form.Control>
                        <Input autoComplete="off" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="last_name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>{t("fields.lastName")}</Form.Label>
                      <Form.Control>
                        <Input autoComplete="off" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.email")}</Form.Label>
                      <Form.Control>
                        <Input autoComplete="off" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="company_name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>{t("fields.company")}</Form.Label>
                      <Form.Control>
                        <Input autoComplete="off" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="phone"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>{t("fields.phone")}</Form.Label>
                      <Form.Control>
                        <Input autoComplete="off" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="role_id"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>{"Customer Role"}</Form.Label>
                      <Form.Control>
                        <Combobox
                          {...field}
                          multiple={false}
                          options={roles.options}
                          onSearchValueChange={roles.onSearchValueChange}
                          searchValue={roles.searchValue}
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
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
              isLoading={isPending}
            >
              {t("actions.create")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
