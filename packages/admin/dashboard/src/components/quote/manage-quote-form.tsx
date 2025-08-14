import { AdminOrder } from "@medusajs/framework/types"
import { Button, DatePicker, Heading, Label, toast } from "@medusajs/ui"
import { useNavigate, useParams } from "react-router-dom"
import { useMemo, useState } from "react"
import { ManageItem } from "./manage-item"
import { useOrderPreview } from "../../hooks/api"
import {
  AdminQuote,
  useConfirmQuote,
  useQuote,
  useUpdateQuote,
  useUpdateQuoteItem,
} from "../../hooks/quotes"
import { formatAmount } from "./utils"
import { Controller, useForm, FormProvider, useFieldArray } from "react-hook-form"
import ErrorMessage from "../custom/components/form/DynamicForm/ErrorMessage"
import { Plus } from "@medusajs/icons"
import { AddVariantSection } from "./add-variant-quote-section"
import { sdk } from "../../lib/client"
import { useComboboxData } from "../../hooks/use-combobox-data"
import { Combobox } from "../inputs/combobox"
type ReturnCreateFormProps = {
  order: AdminOrder
  quote: AdminQuote
}

type FormValues = {
  valid_till: string
  items: {
    [key: string]: {
      quantity: number
      unit_price: number
    }
  }
  variants: Array<{
    variant_id: string
    quantity: number
    unit_price: number
  }>,
  promotion: string
}

export const ManageQuoteForm = ({ order, quote }: ReturnCreateFormProps) => {
  const { quote: preview } = useQuote(quote.id)
  const navigate = useNavigate()
  const { id: quoteId } = useParams()
  const [showAddVariants, setShowAddVariants] = useState(false)

  const { mutateAsync: confirmQuote, isPending: isRequesting } =
    useConfirmQuote(order.id)

  const { mutateAsync: updateQuote, isPending: isPending } = useUpdateQuote(
    quoteId as string
  )

  const { mutateAsync: updateItem } = useUpdateQuoteItem(order.id)

  const form = useForm<FormValues>({
    defaultValues: {
      valid_till: new Date(quote.valid_till).toISOString(),
      items: {},
      variants: [],
      promotion: ""
    },
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
  })

  const { fields: newVariantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: "variants"
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      // Get existing item IDs to differentiate from new variants
      const existingItemIds = new Set(order.items.map(item => item.id))

      // Update existing items only (exclude new variants)
      for (const [itemId, itemData] of Object.entries(data.items)) {
        // Only update if it's an existing item and has changes
        if (existingItemIds.has(itemId) && (itemData.quantity || itemData.unit_price)) {
          await updateItem({
            itemId,
            quantity: Number(itemData.quantity),
            unit_price: Number(itemData.unit_price),
          })
        }
      }

      let variant = []
      // Add new variants as quote items
      for (const newVariant of data.variants) {
        if (newVariant.variant_id && newVariant.quantity && newVariant.unit_price) {
          variant.push({
            variant_id: newVariant.variant_id,
            quantity: newVariant.quantity,
            unit_price: newVariant.unit_price
          })
        }
      }

      // Update quote validity and add new variants
      await updateQuote({
        valid_till: data.valid_till,
        promotion: data.promotion,
        variants: variant
      })

      navigate(`/quote/${quoteId}`)
      toast.success("Successfully updated quote")
    } catch (e) {
      toast.error("Error", {
        description: (e as any).message,
      })
    }
  })

  const addNewVariant = () => {
    appendVariant({
      variant_id: "",
      quantity: 1,
      unit_price: 0
    })
    setShowAddVariants(true)
  }

  const removeNewVariant = (index: number) => {
    removeVariant(index)
    if (newVariantFields.length === 1) {
      setShowAddVariants(false)
    }
  }
  const promotions = useComboboxData({
    queryKey: ["promotions"],
    queryFn: (params) => sdk.admin.promotion.list({ ...params, }),
    getOptions: (data) =>
      data.promotions
        .filter((promotion) => promotion.status === 'active')
        .map((promotion) => ({
          label: promotion.code!,
          value: promotion.code!,
        })),
  })
  const originalItemsMap = useMemo(() => {
    return new Map(order.items.map((item) => [item.id, item]))
  }, [order])

  const existingVariantIds = useMemo(() => {
    const orderVariantIds = order.items.map(item => item.variant_id as string)
    const newVariantIds = form.watch('variants')?.map(v => v.variant_id).filter(Boolean) || []
    return [...orderVariantIds, ...newVariantIds]
  }, [order.items, form.watch('variants')])

  if (!preview) {
    return <></>
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col gap-2 p-4">
        <div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div className="flex flex-col gap-y-1">
              <Label>Valid Till</Label>
            </div>

            <div className="flex items-center gap-1">
              <div className="flex-grow">
                <Controller
                  control={form.control}
                  name="valid_till"
                  rules={{ required: "valid till is required" }}
                  render={({ field }) => {
                    const { onChange, value, ...restField } = field

                    return (
                      <div>
                        <DatePicker
                          granularity="minute"
                          shouldCloseOnSelect={false}
                          {...restField}
                          value={value ? new Date(value) : null}
                          onChange={(date) =>
                            onChange(date?.toISOString() || "")
                          }
                        />
                        <ErrorMessage
                          control={form.control as any}
                          name={field.name}
                          rules={{ required: "valid till is required" }}
                        />
                      </div>
                    )
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mb-3 mt-8 flex items-center justify-between">
            <Heading level="h2">Current Items</Heading>
          </div>

          {preview.draft_order.items.map((item) => (
            <ManageItem
              key={item.id}
              originalItem={originalItemsMap.get(item.id)!}
              item={item}
              orderId={order.id}
              currencyCode={order.currency_code}
            />
          ))}

          {/* Add New Variants Section */}
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <Heading level="h2">Add New Variants</Heading>
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={addNewVariant}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Variant
              </Button>
            </div>

            {!showAddVariants && newVariantFields.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-ui-border-base rounded-lg">
                <p className="text-ui-fg-muted mb-4">No additional variants added</p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addNewVariant}
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add First Variant
                </Button>
              </div>
            )}

            {newVariantFields.map((field, index) => (
              <AddVariantSection
                key={field.id}
                index={index}
                currencyCode={order.currency_code}
                regionId={order.region_id}
                onRemove={() => removeNewVariant(index)}
                canRemove={newVariantFields.length > 1 || newVariantFields.length === 1}
                existingVariantIds={existingVariantIds}
              />
            ))}


          </div>
        </div>
        <Controller
          control={form.control}
          name="promotion"
          render={({ field }) => {
            return (
              <div>
                <Label>Promotion</Label>
                <Combobox
                  {...field}
                  options={promotions.options}
                  searchValue={promotions.searchValue}
                  onSearchValueChange={promotions.onSearchValueChange}
                  fetchNextPage={promotions.fetchNextPage}
                  // defaultChecked={}
                  onChange={(e) => {
                    field.onChange(e)
                  }}
                />
              </div>
            )
          }}
        />
        <div className="mt-8 border-y border-dotted py-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="txt-small text-ui-fg-subtle">Current Total</span>
            <span className="txt-small text-ui-fg-subtle">
              {formatAmount(order.total, order.currency_code)}
            </span>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <span className="txt-small text-ui-fg-subtle">Updated Total</span>
            <span className="txt-small text-ui-fg-subtle">
              {formatAmount(preview.draft_order.total, order.currency_code)}
            </span>
          </div>
        </div>

        <div className="flex w-full items-center justify-end gap-x-4">
          <div className="flex items-center justify-end gap-x-2">
            <Button
              key="submit-button"
              type="submit"
              variant="primary"
              size="small"
              disabled={isRequesting || isPending}
            >
              {newVariantFields.length > 0 ? 'Update & Add Items' : 'Confirm Edit'}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}