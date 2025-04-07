import { HttpTypes } from "@medusajs/types"
import {
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
  toast,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useDate } from "../../../../hooks/use-date"
import { getOrderPaymentStatus } from "../../../../lib/order-helpers"
import { ActionMenu } from "../../../../components/common/action-menu"
import { BellAlert } from "@medusajs/icons"
import { useSendNotificationPendingOrder } from "../../hooks/useSendNotificationPendingOrder"

export const PendingOrderGeneralSection = ({
  cart,
}: {
  cart: HttpTypes.StoreCart
}) => {
  const { t } = useTranslation()
  const { getFullDate } = useDate()

  const { mutateAsync, isPending } = useSendNotificationPendingOrder({
    onSuccess: () => {
      toast.success("Email send successfully")
    },
    onError: (error) => {
      toast.error(error.message || "Email send failed")
    },
  })

  const handleEmailReminder = async () => {
    console.log("handled")
    const email = cart?.email! || (cart as any)?.customer?.email
    const cart_id = cart.id

    await mutateAsync([{ email, cart_id }])
  }

  return (
    <Container className="flex items-center justify-between px-6 py-4">
      <div>
        <div className="flex items-center gap-x-1">
          <Heading>#{cart.id}</Heading>
          <Copy content={`#${cart.id}`} className="text-ui-fg-muted" />
        </div>
        {(cart as any)?.sales_channel! && (
          <Text size="small" className="text-ui-fg-subtle">
            {t("orders.onDateFromSalesChannel", {
              date: getFullDate({ date: cart.created_at!, includeTime: true }),
              salesChannel: (cart as any)?.sales_channel?.name,
            })}
          </Text>
        )}
      </div>
      <div className="flex items-center gap-x-4">
        <div className="flex items-center gap-x-1.5">
          <PaymentBadge
            order={
              {
                payment_status: cart?.payment_collection?.status,
              } as any
            }
          />
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: "Send Email Reminder",
                    onClick: handleEmailReminder,
                    icon: <BellAlert />,
                    disabled: isPending,
                  },
                ],
              },
            ]}
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
