import { AdminPayment, HttpTypes } from "@medusajs/types"
import { Container, Heading, StatusBadge, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import {
  getLocaleAmount,
  getStylizedAmount,
} from "../../../../lib/money-amount-helpers"
import { getOrderPaymentStatus } from "../../../../lib/order-helpers"
import { format } from "date-fns"

type PaymentSessionType = {
  id: string
  currency_code: string
  provider_id: string
  data: Record<string, any>
  context: {
    email: string
    extra: Record<string, any>
    customer: {
      id: string
      email: string
      groups: any[]
    }
  }
  status: string
  authorized_at: null
  payment_collection_id: string
  metadata: null
  raw_amount: {
    value: string
    precision: number
  }
  created_at: string | Date
  updated_at: string | Date
  deleted_at: string | Date | null
  amount: number
}

export const PendingOrderPaymentSection = ({
  cart,
}: {
  cart: HttpTypes.StoreCart
}) => {
  return (
    <Container className="divide-y divide-dashed p-0">
      <Header payment_status={cart.payment_collection?.status!} />
      {cart.payment_collection?.payment_sessions?.length && (
        <PaymentBreakdown
          payments={
            cart.payment_collection
              ?.payment_sessions as unknown as PaymentSessionType
          }
        />
      )}
    </Container>
  )
}

const Header = ({ payment_status }: { payment_status: string }) => {
  const { t } = useTranslation()
  const { label, color } = getOrderPaymentStatus(t, payment_status)

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">{t("orders.payment.title")}</Heading>

      <StatusBadge color={color} className="text-nowrap">
        {label}
      </StatusBadge>
    </div>
  )
}

const Payment = ({ payment }: { payment: PaymentSessionType }) => {
  const getPaymentStatusAttributes = (payment: AdminPayment) => {
    if (payment.canceled_at) {
      return ["Canceled", "red"]
    } else if (payment.captured_at) {
      return ["Captured", "green"]
    } else {
      return ["Pending", "orange"]
    }
  }
  const getPaymentMethod = (payment: AdminPayment) => {
    switch (payment.provider_id) {
      case "pp_pagbank-boleto_pagbank":
        return ["Boleto", "blue"]
      case "pp_pagbank-pix_pagbank":
        return ["PIX", "orange"]
      case "pp_pagbank-cc_pagbank":
        return ["Credit Card", "green"]
      default:
        return ["N/A", "grey"]
    }
  }

  const [status, color] = getPaymentStatusAttributes(payment) as [
    string,
    "green" | "orange" | "red",
  ]

  const [paymentMethod, payemntMethodColor] = getPaymentMethod(payment) as [
    string,
    "green" | "orange" | "red" | "grey",
  ]

  return (
    <div className="divide-y divide-dashed">
      <div className="text-ui-fg-subtle items-center gap-x-4 gap-y-4 px-6 py-4 sm:grid sm:grid-cols-[1fr_1fr_1fr_1fr]">
        <div className="w-full min-w-[60px] overflow-hidden">
          <Text size="small" leading="compact">
            {format(
              new Date(payment.created_at! as string),
              "dd MMM, yyyy, HH:mm:ss"
            )}
          </Text>
        </div>
        <div className="items-center justify-end">
          <StatusBadge color={payemntMethodColor}>{paymentMethod}</StatusBadge>
        </div>
        <div className="flex items-center justify-end">
          <StatusBadge color={color} className="text-nowrap">
            {status}
          </StatusBadge>
        </div>
        <div className="flex items-center justify-end">
          <Text size="small" leading="compact">
            {getStylizedAmount(payment.amount, payment.currency_code)}
            {/* {getLocaleAmount(payment.amount as number, payment.currency_code)} */}
          </Text>
        </div>
      </div>
    </div>
  )
}

const PaymentBreakdown = ({
  payments = [],
}: {
  payments: PaymentSessionType[]
}) => {
  return (
    <div className="flex flex-col divide-y divide-dashed">
      {payments.map((payment) => {
        return <Payment key={payment.id} payment={payment} />
      })}
    </div>
  )
}
