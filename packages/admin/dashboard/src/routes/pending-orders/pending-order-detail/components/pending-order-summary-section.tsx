import { HttpTypes } from "@medusajs/types"
import { Container, Copy, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Thumbnail } from "../../../../components/common/thumbnail"
import {
  getLocaleAmount,
  getStylizedAmount,
} from "../../../../lib/money-amount-helpers"
import { ReactNode } from "react"

export const PendingOrderSummarySection = ({
  cart,
}: {
  cart: HttpTypes.StoreCart
}) => {
  return (
    <Container className="divide-y divide-dashed p-0">
      <Header />
      <ItemBreakDown cart={cart} />
      <CostBreakdown cart={cart} />
      <Total cart={cart} />
    </Container>
  )
}

const Item = ({
  item,
  currencyCode,
}: {
  item: HttpTypes.StoreCartLineItem
  currencyCode: string
}) => {
  return (
    <>
      <div
        key={item.id}
        className="text-ui-fg-subtle grid grid-cols-2 items-center gap-x-4 px-6 py-4"
      >
        <div className="flex items-start gap-x-4">
          <Thumbnail src={item.thumbnail} />
          <div>
            <Text
              size="small"
              leading="compact"
              weight="plus"
              className="text-ui-fg-base"
            >
              {item.title}
            </Text>

            {item.variant_sku && (
              <div className="flex items-center gap-x-1">
                <Text size="small">{item.variant_sku}</Text>
                <Copy content={item.variant_sku} className="text-ui-fg-muted" />
              </div>
            )}
            <Text size="small">
              {item.variant?.options?.map((o) => o.value).join(" · ")}
            </Text>
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-x-4">
          <div className="flex items-center justify-end gap-x-4">
            <Text size="small">
              {getLocaleAmount(item.unit_price, currencyCode)}
            </Text>
          </div>

          <div className="flex items-center gap-x-2">
            <div className="w-fit min-w-[27px]">
              <Text size="small">
                <span className="tabular-nums">{item.quantity}</span>x
              </Text>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Text size="small" className="pt-[1px]">
              {getLocaleAmount(
                item.subtotal || item.quantity * item.unit_price,
                currencyCode
              )}
            </Text>
          </div>
        </div>
      </div>
    </>
  )
}

const Cost = ({
  label,
  value,
  secondaryValue,
  tooltip,
}: {
  label: ReactNode
  value: string | number
  secondaryValue?: string
  tooltip?: ReactNode
}) => (
  <div className="grid grid-cols-3 items-center">
    <Text size="small" leading="compact">
      {label} {tooltip}
    </Text>
    <div className="text-right">
      <Text size="small" leading="compact">
        {secondaryValue}
      </Text>
    </div>
    <div className="text-right">
      <Text size="small" leading="compact">
        {value}
      </Text>
    </div>
  </div>
)

const Header = () => {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">{t("fields.summary")}</Heading>
    </div>
  )
}

const ItemBreakDown = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  return (
    <div>
      {cart.items?.map((item) => {
        return (
          <Item
            key={item.id}
            item={item as any}
            currencyCode={cart.currency_code}
          />
        )
      })}
    </div>
  )
}

const CostBreakdown = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const { t } = useTranslation()

  const automaticTaxesOn = !!cart.region?.automatic_taxes

  return (
    <div className="text-ui-fg-subtle flex flex-col gap-y-2 px-6 py-4">
      <Cost
        label={t(
          automaticTaxesOn
            ? "orders.summary.itemTotal"
            : "orders.summary.itemSubtotal"
        )}
        value={getLocaleAmount(cart.item_total, cart.currency_code)}
      />
      <Cost
        label={t("orders.summary.shippingTotal")}
        value={getLocaleAmount(cart.shipping_total, cart.currency_code)}
      />
      <Cost
        label={t("orders.summary.discountTotal")}
        value={getLocaleAmount(cart.discount_total, cart.currency_code)}
      />
      <Cost
        label={t("orders.summary.taxTotal")}
        value={getLocaleAmount(cart.tax_total, cart.currency_code)}
      />
    </div>
  )
}

const Total = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const { t } = useTranslation()

  return (
    <div className=" flex flex-col gap-y-2 px-6 py-4">
      <div className="text-ui-fg-base flex items-center justify-between">
        <Text
          weight="plus"
          className="text-ui-fg-subtle"
          size="small"
          leading="compact"
        >
          {t("fields.total")}
        </Text>
        <Text
          weight="plus"
          className="text-ui-fg-subtle"
          size="small"
          leading="compact"
        >
          {getStylizedAmount(cart.total, cart.currency_code)}
        </Text>
      </div>
    </div>
  )
}
