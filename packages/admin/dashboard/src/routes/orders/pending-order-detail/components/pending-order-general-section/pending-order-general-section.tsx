import { CartDTO, HttpTypes } from "@medusajs/types"
import { Container, Copy, Heading, StatusBadge, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useDate } from "../../../../../hooks/use-date"
import { getOrderPaymentStatus } from "../../../../../lib/order-helpers"

export const PendingOrderGeneralSection = ({
  cart,
}: {
  cart: CartDTO & { [key: string]: any }
}) => {
  const { t } = useTranslation()
  const { getFullDate } = useDate()

  return (
    <Container className="flex items-center justify-between px-6 py-4">
      <div>
        <div className="flex items-center gap-x-1">
          <Heading>#{cart.id}</Heading>
          <Copy content={`#${cart.id}`} className="text-ui-fg-muted" />
        </div>
        <Text size="small" className="text-ui-fg-subtle">
          {t("orders.onDateFromSalesChannel", {
            date: getFullDate({ date: cart.created_at!, includeTime: true }),
            salesChannel: cart.sales_channel?.name,
          })}
        </Text>
      </div>
      <div className="flex items-center gap-x-4">
        <div className="flex items-center gap-x-1.5">
          <PaymentBadge
            order={
              {
                payment_status: cart.payment_collection.status,
              } as any
            }
          />
        </div>
      </div>
    </Container>
  )
}

const PaymentBadge = ({ order }: { order: HttpTypes.AdminOrder }) => {
  const { t } = useTranslation()

  const { label, color } = getOrderPaymentStatus(t, order.payment_status)

  return (
    <StatusBadge color={color} className="text-nowrap">
      {label}
    </StatusBadge>
  )
}
