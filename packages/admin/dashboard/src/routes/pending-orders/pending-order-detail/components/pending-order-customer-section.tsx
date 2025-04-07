import { HttpTypes } from "@medusajs/types"
import { Avatar, Container, Copy, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { getFormattedAddress, isSameAddress } from "../../../../lib/addresses"

export const PendingOrderCustomerSection = ({
  cart,
}: {
  cart: HttpTypes.StoreCart
}) => {
  return (
    <Container className="divide-y p-0">
      <Header />
      <CustomerInfoID data={cart} />
      <CustomerInfoContact data={cart} />
      <CustomerInfoCompany data={cart} />
      <CustomerInfoAddresses data={cart} />
    </Container>
  )
}

const Header = () => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">{t("fields.customer")}</Heading>
    </div>
  )
}

const CustomerInfoID = ({ data }: { data: HttpTypes.StoreCart }) => {
  const { t } = useTranslation()

  const id = data.customer_id
  const name = getOrderCustomer(data as any)
  const email = data.email
  const fallback = (name || email || "").charAt(0).toUpperCase()

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        {t("fields.id")}
      </Text>
      <Link
        to={`/customers/${id}`}
        className="focus:shadow-borders-focus rounded-[4px] outline-none transition-shadow"
      >
        <div className="flex items-center gap-x-2 overflow-hidden">
          <Avatar size="2xsmall" fallback={fallback} />
          <Text
            size="small"
            leading="compact"
            className="text-ui-fg-subtle hover:text-ui-fg-base transition-fg truncate"
          >
            {name || email}
          </Text>
        </div>
      </Link>
    </div>
  )
}

const CustomerInfoContact = ({ data }: { data: HttpTypes.StoreCart }) => {
  const { t } = useTranslation()

  const phone = data.shipping_address?.phone || data.billing_address?.phone
  const email = data.email || ""

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        {t("orders.customer.contactLabel")}
      </Text>
      <div className="flex flex-col gap-y-2">
        <div className="grid grid-cols-[1fr_20px] items-start gap-x-2">
          <Text
            size="small"
            leading="compact"
            className="text-pretty break-all"
          >
            {email}
          </Text>

          <div className="flex justify-end">
            <Copy content={email} className="text-ui-fg-muted" />
          </div>
        </div>
        {phone && (
          <div className="grid grid-cols-[1fr_20px] items-start gap-x-2">
            <Text
              size="small"
              leading="compact"
              className="text-pretty break-all"
            >
              {phone}
            </Text>

            <div className="flex justify-end">
              <Copy content={email} className="text-ui-fg-muted" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const CustomerInfoCompany = ({ data }: { data: HttpTypes.StoreCart }) => {
  const { t } = useTranslation()
  const company =
    data.shipping_address?.company || data.billing_address?.company

  if (!company) {
    return null
  }

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        {t("fields.company")}
      </Text>
      <Text size="small" leading="compact" className="truncate">
        {company}
      </Text>
    </div>
  )
}

const AddressPrint = ({
  address,
  type,
}: {
  address:
    | HttpTypes.StoreCart["shipping_address"]
    | HttpTypes.StoreCart["billing_address"]
  type: "shipping" | "billing"
}) => {
  const { t } = useTranslation()

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        {type === "shipping"
          ? t("addresses.shippingAddress.label")
          : t("addresses.billingAddress.label")}
      </Text>
      {address ? (
        <div className="grid grid-cols-[1fr_20px] items-start gap-x-2">
          <Text size="small" leading="compact">
            {getFormattedAddress({
              address: {
                created_at: address.created_at,
                id: address.id,
                metadata: address?.metadata || null,
                updated_at: address.updated_at,
                address_1: address.address_1,
                address_2: address.address_2,
                city: address.city,
                company: address.company,
                country_code: address.country_code,
                customer_id: address.customer_id,
                first_name: address.first_name,
                last_name: address.last_name,
                phone: address.phone,
                postal_code: address.postal_code,
                province: address.province,
              },
            }).map((line, i) => {
              return (
                <span key={i} className="break-words">
                  {line}
                  <br />
                </span>
              )
            })}
          </Text>
          <div className="flex justify-end">
            <Copy
              content={getFormattedAddress({
                address: {
                  created_at: address.created_at,
                  id: address.id,
                  metadata: address?.metadata || null,
                  updated_at: address.updated_at,
                  address_1: address.address_1,
                  address_2: address.address_2,
                  city: address.city,
                  company: address.company,
                  country_code: address.country_code,
                  customer_id: address.customer_id,
                  first_name: address.first_name,
                  last_name: address.last_name,
                  phone: address.phone,
                  postal_code: address.postal_code,
                  province: address.province,
                },
              }).join("\n")}
              className="text-ui-fg-muted"
            />
          </div>
        </div>
      ) : (
        <Text size="small" leading="compact">
          -
        </Text>
      )}
    </div>
  )
}

const CustomerInfoAddresses = ({ data }: { data: HttpTypes.StoreCart }) => {
  const { t } = useTranslation()

  return (
    <div className="divide-y">
      <AddressPrint address={data.shipping_address} type="shipping" />
      {data.shipping_address && data.billing_address && (
        <>
          {!isSameAddress(data.shipping_address, data.billing_address) ? (
            <AddressPrint address={data.billing_address} type="billing" />
          ) : (
            <div className="grid grid-cols-2 items-center px-6 py-4">
              <Text
                size="small"
                leading="compact"
                weight="plus"
                className="text-ui-fg-subtle"
              >
                {t("addresses.billingAddress.label")}
              </Text>
              <Text size="small" leading="compact" className="text-ui-fg-muted">
                {t("addresses.billingAddress.sameAsShipping")}
              </Text>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const getOrderCustomer = (obj: {
  shipping_address: any
  customer: any
  billing_address: any
}) => {
  const { first_name: sFirstName, last_name: sLastName } =
    obj?.shipping_address || {}
  const { first_name: bFirstName, last_name: bLastName } =
    obj?.billing_address || {}
  const { first_name: cFirstName, last_name: cLastName } = obj?.customer || {}

  const customerName = [cFirstName, cLastName].filter(Boolean).join(" ")
  const shippingName = [sFirstName, sLastName].filter(Boolean).join(" ")
  const billingName = [bFirstName, bLastName].filter(Boolean).join(" ")

  const name = customerName || shippingName || billingName

  return name
}
