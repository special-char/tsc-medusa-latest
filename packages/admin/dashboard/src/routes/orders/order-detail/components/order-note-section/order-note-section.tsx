import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderPaymentSectionProps = {
  order: HttpTypes.AdminOrder
}

export const OrderNoteSection = ({ order }: OrderPaymentSectionProps) => {
  const note = order?.metadata?.note
  if (!note) {
    return null
  }
  return (
    <div className="flex flex-wrap items-center gap-2 px-6 py-4">
      <Text>Order Note:-</Text>
      <Text>{note as string}</Text>
    </div>
  )
}
