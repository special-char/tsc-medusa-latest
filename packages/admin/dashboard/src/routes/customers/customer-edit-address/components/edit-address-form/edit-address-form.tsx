import { Button, Input, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Form } from "../../../../../components/common/form/index.ts"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/modals/index.ts"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form/keybound-form.tsx"
import { AdminCustomerAddress, HttpTypes } from "@medusajs/types"
import * as zod from "zod"
import { sdk } from "../../../../../lib/client/client.ts"
import { useEffect, useState } from "react"
import { useUpdateCustomerAddress } from "../../../../../hooks/api/customers.tsx"
import { useNavigate } from "react-router-dom"

const EditCustomerSchema = zod.object({
  first_name: zod.string().optional(),
  last_name: zod.string().optional(),
  company_name: zod.string().optional(),
  phone: zod.string().optional(),
  address_1: zod.string().optional(),
  address_2: zod.string().optional(),
  city: zod.string().optional(),
  province: zod.string().optional(),
  postal_code: zod.string().optional(),
  cpf: zod.string().optional(),
  number: zod.string().optional(),
  complement: zod.string().optional(),
})

export const EditCustomerAddressForm = ({
  customer,
  address_id,
}: {
  customer: HttpTypes.AdminCustomer
  address_id: string
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { handleSuccess } = useRouteModal()

  const [cusAddr, setCusAddr] = useState<Partial<AdminCustomerAddress>>({})

  console.log("cusaddr", cusAddr)

  const form = useForm({
    defaultValues: {
      ...EditCustomerSchema.parse(cusAddr),
      cpf: cusAddr?.metadata?.cpf || "",
      number: cusAddr?.metadata?.number || "",
      complement: cusAddr?.metadata?.complement || "",
    },
  })

  const fetchCustomerAddress = async () => {
    const fetchedAddr = await sdk.admin.customer.listCustomerAddress(
      customer?.id,
      address_id
    )
    setCusAddr(fetchedAddr.address)
    form.reset(EditCustomerSchema.parse(fetchedAddr.address))
  }

  const { mutateAsync } = useUpdateCustomerAddress(customer?.id, address_id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        phone: data.phone || "",
        company: data.company_name || "",
        address_1: data.address_1 || "",
        address_2: data.address_2 || "",
        city: data.city || "",
        province: data.province || "",
        postal_code: data.postal_code || "",
        metadata: {
          cpf: data?.cpf || "",
          number: data.number || "",
          complement: data?.complement || "",
        },
      },
      {
        onSuccess: () => {
          handleSuccess(`/customers/${customer?.id}`)
          // navigate(`/customers/${customer?.id}`, {
          //   replace: true,
          //   state: { isSubmitSuccessful: true },
          // })
          navigate(0)
          toast.success("Address uodated successfully")
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  useEffect(() => {
    if (customer?.id && address_id) {
      fetchCustomerAddress()
    }
  }, [customer, address_id])

  useEffect(() => {
    if (cusAddr && Object.keys(cusAddr).length > 0) {
      form.reset({
        ...EditCustomerSchema.parse(cusAddr),
        cpf: cusAddr.metadata?.cpf || "",
        number: cusAddr.metadata?.number || "",
        complement: cusAddr.metadata?.complement || "",
      })
    }
  }, [cusAddr])

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body className="py-0">
          <div className="flex h-[calc(100vh-140px)] flex-col gap-y-4 overflow-scroll px-2 py-2">
            <Form.Field
              control={form.control}
              name="first_name"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.firstName")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
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
                    <Form.Label>{t("fields.lastName")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
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
                    <Form.Label>{t("fields.company")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
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
                    <Form.Label>{t("fields.phone")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="address_1"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.address")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="address_2"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>Address2</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="city"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.city")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="province"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.province")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="postal_code"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.postalCode")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="cpf"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>Cpf</Form.Label>
                    <Form.Control>
                      {/* TODO: solve type */}

                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="number"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>Number</Form.Label>
                    <Form.Control>
                      {/* TODO: solve type */}
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="complement"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>Complement</Form.Label>
                    <Form.Control>
                      {/* TODO: solve type */}

                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button
              // isLoading={isPending}
              type="submit"
              variant="primary"
              size="small"
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
