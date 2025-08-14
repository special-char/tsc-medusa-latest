import { AdminOrder, AdminOrderPreview } from "@medusajs/framework/types"
import { Badge, CurrencyInput, Hint, Input, Label, Text } from "@medusajs/ui"
import { useMemo } from "react"
import { Amount } from "./amount"
import { Controller, useFormContext } from "react-hook-form"

type ManageItemProps = {
  originalItem: AdminOrder["items"][0]
  item: AdminOrderPreview["items"][0]
  currencyCode: string
  orderId: string
}

export function ManageItem({
  originalItem,
  item,
  currencyCode,
  orderId,
}: ManageItemProps) {
  useFormContext() // Just to establish form context

  const isItemUpdated = useMemo(
    () => !!item.actions?.find((a) => a.action === "ITEM_UPDATE"),
    [item]
  )

  return (
    <div
      key={item.quantity}
      className="bg-ui-bg-subtle shadow-elevation-card-rest my-2 rounded-xl "
    >
      <div className="flex flex-col items-center gap-x-2 gap-y-2 p-3 text-sm md:flex-row">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-row items-center gap-x-3">
            <div className="flex flex-col">
              <div>
                <Text className="txt-small" as="span" weight="plus">
                  {item.title}{" "}
                </Text>

                {item.variant_sku && <span>({item.variant_sku})</span>}
              </div>
              <Text as="div" className="text-ui-fg-subtle txt-small">
                {item.product_title}
              </Text>
            </div>
          </div>

          {isItemUpdated && (
            <Badge
              size="2xsmall"
              rounded="full"
              color="orange"
              className="mr-1"
            >
              Modified
            </Badge>
          )}
        </div>

        <div className="flex flex-1 justify-between">
          <div className="flex flex-grow items-center gap-2">
            <Controller
              name={`items.${item.id}.quantity`}
              defaultValue={item.quantity}
              render={({ field }) => (
                <Input
                  {...field}
                  className="bg-ui-bg-base txt-small w-[67px] rounded-lg [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  type="number"
                  disabled={item.detail.fulfilled_quantity === item.quantity}
                  min={item.detail.fulfilled_quantity}
                />
              )}
            />
            <Text className="txt-small text-ui-fg-subtle">Quantity</Text>
          </div>

          <div className="text-ui-fg-subtle txt-small mr-2 flex flex-shrink-0">
            <Amount
              currencyCode={currencyCode}
              amount={item.subtotal}
              originalAmount={originalItem?.subtotal}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 p-3 md:grid-cols-2">
        <div className="flex flex-col gap-y-1">
          <Label>Price</Label>
          <Hint className="!mt-1">Override the unit price of this product</Hint>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex-grow">
            <Controller
              name={`items.${item.id}.unit_price`}
              defaultValue={item.unit_price}
              render={({ field }) => (
                <CurrencyInput
                  {...field}
                  symbol={currencyCode}
                  code={currencyCode}
                  type="numeric"
                  max={999999999999999}
                  min={0}
                  style={{ textAlign: "left" }}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/,/g, "")
                    const numericValue = Number(raw)
                    if (!isNaN(numericValue)) {
                      field.onChange(numericValue)
                    } else {
                      field.onChange("")
                    }
                  }}
                  className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover"
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
