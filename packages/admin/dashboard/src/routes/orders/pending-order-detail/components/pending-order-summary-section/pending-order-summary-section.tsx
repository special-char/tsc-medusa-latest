import { useTranslation } from "react-i18next"

import { CartDTO, CartLineItemDTO } from "@medusajs/types"
import { Container, Copy, Heading, Text } from "@medusajs/ui"

import { Thumbnail } from "../../../../../components/common/thumbnail"
import {
  getLocaleAmount,
  getStylizedAmount,
} from "../../../../../lib/money-amount-helpers"
import { getTotalCaptured } from "../../../../../lib/payment"

export const PendingOrderSummarySection = ({ cart }: { cart: CartDTO }) => {
  return (
    <Container className="divide-y divide-dashed p-0">
      <Header />
      <ItemBreakdown cart={cart} />
      {/* <CostBreakdown order={order} /> */}
      <Total cart={cart} />
      {/* <OrderNoteSection order={order} /> */}

      {/* {(showAllocateButton || showReturns || showPayment || showRefund) && (
        <div className="bg-ui-bg-subtle flex items-center justify-end gap-x-2 rounded-b-xl px-4 py-4">
          {showReturns &&
            (receivableReturns.length === 1 ? (
              <Button
                onClick={() =>
                  navigate(
                    `/orders/${order.id}/returns/${receivableReturns[0].id}/receive`
                  )
                }
                variant="secondary"
                size="small"
              >
                {t("orders.returns.receive.action")}
              </Button>
            ) : (
              <ActionMenu
                groups={[
                  {
                    actions: receivableReturns.map((r) => {
                      let id = r.id
                      let returnType = "Return"

                      if (r.exchange_id) {
                        id = r.exchange_id
                        returnType = "Exchange"
                      }

                      if (r.claim_id) {
                        id = r.claim_id
                        returnType = "Claim"
                      }

                      return {
                        label: t("orders.returns.receive.receiveItems", {
                          id: `#${id.slice(-7)}`,
                          returnType,
                        }),
                        icon: <ArrowLongRight />,
                        to: `/orders/${order.id}/returns/${r.id}/receive`,
                      }
                    }),
                  },
                ]}
              >
                <Button variant="secondary" size="small">
                  {t("orders.returns.receive.action")}
                </Button>
              </ActionMenu>
            ))}

          {showAllocateButton && (
            <Button
              onClick={() => navigate(`./allocate-items`)}
              variant="secondary"
            >
              {t("orders.allocateItems.action")}
            </Button>
          )}

          {showPayment && (
            <CopyPaymentLink
              paymentCollection={unpaidPaymentCollection}
              order={order}
            />
          )}

          {showPayment && (
            <Button
              size="small"
              variant="secondary"
              onClick={() => handleMarkAsPaid(unpaidPaymentCollection)}
            >
              {t("orders.payment.markAsPaid")}
            </Button>
          )}

          {showRefund && (
            <Button
              size="small"
              variant="secondary"
              onClick={() => navigate(`/orders/${order.id}/refund`)}
            >
              {t("orders.payment.refundAmount", {
                amount: getStylizedAmount(
                  (order?.summary?.pending_difference || 0) * -1,
                  order?.currency_code
                ),
              })}
            </Button>
          )}
        </div>
      )} */}
    </Container>
  )
}

const Header = () => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">{t("fields.summary")}</Heading>
    </div>
  )
}

const Item = ({
  item,
  currencyCode,
}: {
  item: CartLineItemDTO
  currencyCode: string
}) => {
  const { t } = useTranslation()

  const isInventoryManaged = (item as any)?.variant?.manage_inventory
  const hasInventoryKit =
    isInventoryManaged &&
    ((item as any).variant?.inventory_items?.length || 0) > 1
  // const hasUnfulfilledItems = item.quantity - item.detail.fulfilled_quantity > 0

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
            {(item as any)?.variant && (
              <Text size="small">
                {(item as any)?.variant?.options
                  ?.map((o) => o.value)
                  .join(" · ")}
              </Text>
            )}
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

            {/* <div className="overflow-visible">
              {isInventoryManaged && hasUnfulfilledItems && (
                <StatusBadge
                  color={reservation ? "green" : "orange"}
                  className="text-nowrap"
                >
                  {reservation
                    ? t("orders.reservations.allocatedLabel")
                    : t("orders.reservations.notAllocatedLabel")}
                </StatusBadge>
              )}
            </div> */}
          </div>

          <div className="flex items-center justify-end">
            <Text size="small" className="pt-[1px]">
              {getLocaleAmount(
                item.quantity * item.unit_price || 0,
                currencyCode
              )}
            </Text>
          </div>
        </div>
      </div>

      {/* {hasInventoryKit && (
        <InventoryKitBreakdown item={item as unknown as AdminOrderLineItem} />
      )} */}
    </>
  )
}

const ItemBreakdown = ({ cart }: { cart: CartDTO }) => {
  return (
    <div>
      {cart.items?.map((item) => {
        return (
          <Item key={item.id} item={item} currencyCode={cart.currency_code} />
        )
      })}
    </div>
  )
}

// const Cost = ({
//   label,
//   value,
//   secondaryValue,
//   tooltip,
// }: {
//   label: ReactNode
//   value: string | number
//   secondaryValue?: string
//   tooltip?: ReactNode
// }) => (
//   <div className="grid grid-cols-3 items-center">
//     <Text size="small" leading="compact">
//       {label} {tooltip}
//     </Text>
//     <div className="text-right">
//       <Text size="small" leading="compact">
//         {secondaryValue}
//       </Text>
//     </div>
//     <div className="text-right">
//       <Text size="small" leading="compact">
//         {value}
//       </Text>
//     </div>
//   </div>
// )

// const CostBreakdown = ({
//   order,
// }: {
//   order: AdminOrder & { region?: AdminRegion | null }
// }) => {
//   const { t } = useTranslation()
//   const [isTaxOpen, setIsTaxOpen] = useState(false)
//   const [isShippingOpen, setIsShippingOpen] = useState(false)

//   const discountCodes = useMemo(() => {
//     const codes = new Set()
//     order.items.forEach((item) =>
//       item.adjustments?.forEach((adj) => {
//         codes.add(adj.code)
//       })
//     )

//     return Array.from(codes).sort()
//   }, [order])

//   const taxCodes = useMemo(() => {
//     const taxCodeMap = {}

//     order.items.forEach((item) => {
//       item.tax_lines?.forEach((line) => {
//         taxCodeMap[line.code] = (taxCodeMap[line.code] || 0) + line.total
//       })
//     })

//     order.shipping_methods.forEach((sm) => {
//       sm.tax_lines?.forEach((line) => {
//         taxCodeMap[line.code] = (taxCodeMap[line.code] || 0) + line.total
//       })
//     })

//     return taxCodeMap
//   }, [order])

//   const automaticTaxesOn = !!order.region?.automatic_taxes
//   const hasTaxLines = !!Object.keys(taxCodes).length

//   const discountTotal = automaticTaxesOn
//     ? order.discount_total
//     : order.discount_subtotal

//   return (
//     <div className="text-ui-fg-subtle flex flex-col gap-y-2 px-6 py-4">
//       <Cost
//         label={t(
//           automaticTaxesOn
//             ? "orders.summary.itemTotal"
//             : "orders.summary.itemSubtotal"
//         )}
//         value={getLocaleAmount(order.item_total, order.currency_code)}
//       />
//       <Cost
//         label={
//           <div
//             onClick={() => setIsShippingOpen((o) => !o)}
//             className="flex cursor-pointer items-center gap-1"
//           >
//             <span>
//               {t(
//                 automaticTaxesOn
//                   ? "orders.summary.shippingTotal"
//                   : "orders.summary.shippingSubtotal"
//               )}
//             </span>
//             <TriangleDownMini
//               style={{
//                 transform: `rotate(${isShippingOpen ? 0 : -90}deg)`,
//               }}
//             />
//           </div>
//         }
//         value={getLocaleAmount(
//           automaticTaxesOn ? order.shipping_total : order.shipping_subtotal,
//           order.currency_code
//         )}
//       />

//       {isShippingOpen && (
//         <div className="flex flex-col gap-1 pl-5">
//           {(order.shipping_methods || [])
//             .sort((m1, m2) =>
//               (m1.created_at as string).localeCompare(m2.created_at as string)
//             )
//             .map((sm, i) => {
//               return (
//                 <div
//                   key={sm.id}
//                   className="flex items-center justify-between gap-x-2"
//                 >
//                   <div>
//                     <span className="txt-small text-ui-fg-subtle font-medium">
//                       {sm.name}
//                       {sm.detail.return_id &&
//                         ` (${t("fields.returnShipping")})`}{" "}
//                       <ShippingInfoPopover key={i} shippingMethod={sm} />
//                     </span>
//                   </div>
//                   <div className="relative flex-1">
//                     <div className="bottom-[calc(50% - 2px)] absolute h-[1px] w-full border-b border-dashed" />
//                   </div>
//                   <span className="txt-small text-ui-fg-muted">
//                     {getLocaleAmount(
//                       automaticTaxesOn ? sm.total : sm.subtotal,
//                       order.currency_code
//                     )}
//                   </span>
//                 </div>
//               )
//             })}
//         </div>
//       )}

//       <Cost
//         label={t(
//           automaticTaxesOn
//             ? "orders.summary.discountTotal"
//             : "orders.summary.discountSubtotal"
//         )}
//         secondaryValue={discountCodes.join(", ")}
//         value={
//           discountTotal > 0
//             ? `- ${getLocaleAmount(discountTotal, order.currency_code)}`
//             : "-"
//         }
//       />

//       <>
//         <div className="flex justify-between">
//           <div
//             onClick={() => hasTaxLines && setIsTaxOpen((o) => !o)}
//             className={clx("flex items-center gap-1", {
//               "cursor-pointer": hasTaxLines,
//             })}
//           >
//             <span className="txt-small select-none">
//               {t(
//                 automaticTaxesOn
//                   ? "orders.summary.taxTotalIncl"
//                   : "orders.summary.taxTotal"
//               )}
//             </span>
//             {hasTaxLines && (
//               <TriangleDownMini
//                 style={{
//                   transform: `rotate(${isTaxOpen ? 0 : -90}deg)`,
//                 }}
//               />
//             )}
//           </div>

//           <div className="text-right">
//             <Text size="small" leading="compact">
//               {getLocaleAmount(order.tax_total, order.currency_code)}
//             </Text>
//           </div>
//         </div>
//         {isTaxOpen && (
//           <div className="flex flex-col gap-1 pl-5">
//             {Object.entries(taxCodes).map(([code, total]) => {
//               return (
//                 <div
//                   key={code}
//                   className="flex items-center justify-between gap-x-2"
//                 >
//                   <div>
//                     <span className="txt-small text-ui-fg-subtle font-medium">
//                       {code}
//                     </span>
//                   </div>
//                   <div className="relative flex-1">
//                     <div className="bottom-[calc(50% - 2px)] absolute h-[1px] w-full border-b border-dashed" />
//                   </div>
//                   <span className="txt-small text-ui-fg-muted">
//                     {getLocaleAmount(total, order.currency_code)}
//                   </span>
//                 </div>
//               )
//             })}
//           </div>
//         )}
//       </>
//     </div>
//   )
// }

// const InventoryKitBreakdown = ({ item }: { item: AdminOrderLineItem }) => {
//   const { t } = useTranslation()

//   const [isOpen, setIsOpen] = useState(false)

//   const inventory = item.variant?.inventory_items || []

//   return (
//     <>
//       <div
//         onClick={() => setIsOpen((o) => !o)}
//         className="flex cursor-pointer items-center gap-2 border-t border-dashed px-6 py-4"
//       >
//         <TriangleDownMini
//           style={{
//             transform: `rotate(${isOpen ? 0 : -90}deg)`,
//           }}
//         />
//         <span className="text-ui-fg-muted txt-small select-none">
//           {t("orders.summary.inventoryKit", { count: inventory.length })}
//         </span>
//       </div>
//       {isOpen && (
//         <div className="flex flex-col gap-1 px-6 pb-4">
//           {inventory.map((i) => {
//             return (
//               <div
//                 key={i.inventory.id}
//                 className="flex items-center justify-between gap-x-2"
//               >
//                 <div>
//                   <span className="txt-small text-ui-fg-subtle font-medium">
//                     {i.inventory.title}

//                     {i.inventory.sku && (
//                       <span className="text-ui-fg-subtle font-normal">
//                         {" "}
//                         ⋅ {i.inventory.sku}
//                       </span>
//                     )}
//                   </span>
//                 </div>
//                 <div className="relative flex-1">
//                   <div className="bottom-[calc(50% - 2px)] absolute h-[1px] w-full border-b border-dashed" />
//                 </div>
//                 <span className="txt-small text-ui-fg-muted">
//                   {i.required_quantity}x
//                 </span>
//               </div>
//             )
//           })}
//         </div>
//       )}
//     </>
//   )
// }

const Total = ({ cart }: { cart: any }) => {
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

      <div className="text-ui-fg-base flex items-center justify-between">
        <Text
          weight="plus"
          className="text-ui-fg-subtle"
          size="small"
          leading="compact"
        >
          {t("fields.paidTotal")}
        </Text>
        <Text
          weight="plus"
          className="text-ui-fg-subtle"
          size="small"
          leading="compact"
        >
          {getStylizedAmount(
            getTotalCaptured(cart.payment_collections || []),
            cart.currency_code
          )}
        </Text>
      </div>

      <div className="text-ui-fg-base flex items-center justify-between">
        <Text
          className="text-ui-fg-subtle text-semibold"
          size="small"
          leading="compact"
          weight="plus"
        >
          {t("orders.returns.outstandingAmount")}
        </Text>
        {/* <Text
          className="text-ui-fg-subtle text-bold"
          size="small"
          leading="compact"
          weight="plus"
        >
          {getStylizedAmount(
            order.summary.pending_difference || 0,
            order.currency_code
          )}
        </Text> */}
      </div>
    </div>
  )
}
