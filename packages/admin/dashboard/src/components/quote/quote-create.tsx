import { Controller, UseFormReturn, useFieldArray } from "react-hook-form"
import { useState } from "react"
import {
  Button,
  ProgressStatus,
  ProgressTabs,
  Input,
  Label,
  CurrencyInput,
  DatePicker,
} from "@medusajs/ui"
import { Spinner, Plus, Trash } from "@medusajs/icons"
import { RouteFocusModal } from "../modals"
import { KeyboundForm } from "../utilities/keybound-form"
import { useComboboxData } from "../../hooks/use-combobox-data"
import { sdk } from "../../lib/client"
import ErrorMessage from "../../routes/products/product-detail/components/product-seo/components/form/DynamicForm/ErrorMessage"
import { Combobox } from "../inputs/combobox"
import CustomerCreateModal from "./create-customer"

type Props = {
  form: UseFormReturn<any, any, undefined>
  onSubmit: (data: any) => void
}

export enum QuoteCreateTab {
  QUOTE_CREATE = "Quote-Create",
}

type TabState = Record<QuoteCreateTab, ProgressStatus>

const QuoteCreateForm = (props: Props) => {
  const [tab, setTab] = useState<QuoteCreateTab>(QuoteCreateTab.QUOTE_CREATE)

  const [tabState, setTabState] = useState<TabState>({
    [QuoteCreateTab.QUOTE_CREATE]: "in-progress",
  })
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [currencyCode, setCurrencyCode] = useState<string>("")
  const [prices, setPrices] = useState<{ [key: string]: string }>({})

  // Use useFieldArray to manage multiple variants
  const { fields, append, remove } = useFieldArray({
    control: props.form.control,
    name: "variants" // This will be an array of variant objects
  })

  const handleTabChange = async (tab: QuoteCreateTab) => {
    if (tab === QuoteCreateTab.QUOTE_CREATE) {
      setTab(tab)
      setTabState((prev) => ({
        ...prev,
        [QuoteCreateTab.QUOTE_CREATE]: "in-progress",
      }))
      return
    }
    const valid = await props.form.trigger([
      "region_id",
      "customer_id",
      "variants",
      "valid_till",
    ])
    if (!valid) {
      return
    }
  }

  const handleContinue = async () => {
    switch (tab) {
      case QuoteCreateTab.QUOTE_CREATE: {
        // Validate all fields including dynamic variants
        const valid = await props.form.trigger([
          "region_id",
          "customer_id",
          "variants",
          "valid_till",
        ])
        if (valid) {
          handleTabChange(QuoteCreateTab.QUOTE_CREATE)
        }
        break
      }
      default:
        break
    }
    await props.form.handleSubmit(props.onSubmit)()
  }

  // Function to add a new variant
  const addVariant = () => {
    append({
      variant_id: "",
      quantity: "",
      unit_price: ""
    })
  }

  // Function to remove a variant (but keep at least one)
  const removeVariant = (index: number) => {
    if (fields.length > 1) {
      remove(index)
      // Clean up the price state for removed field
      const newPrices = { ...prices }
      delete newPrices[`variant_${index}`]
      setPrices(newPrices)
    }
  }

  // Update price for specific variant
  const updatePrice = (index: number, price: string) => {
    setPrices(prev => ({
      ...prev,
      [`variant_${index}`]: price
    }))
  }

  const [customerKey, setCustomerKey] = useState(0)
  const region = useComboboxData({
    queryKey: ["region"],
    queryFn: (params) => sdk.admin.region.list(params),
    getOptions: (data) =>
      data.regions.map((type) => ({
        label: type.name,
        value: type.id,
        currency_code: type.currency_code,
      })),
  })
  const customer = useComboboxData({
    queryKey: ["customer"],
    queryFn: (params) => sdk.admin.customer.list(params),
    getOptions: (data) =>
      data.customers.map((type) => ({
        label: `${type.email} (${type?.has_account === false ? "Guest" : "Registered"})`,
        value: type.id,
      })),
  })
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
  const selectedRegionId = props.form.watch("region_id")
  const variant = useComboboxData({
    queryKey: ["variant", selectedRegionId],
    queryFn: (params: any) =>
      sdk.client.fetch<any>(
        `admin/product-variant?region_id=${selectedRegionId}&fields=*variants.calculated_price${params.q ? `&q=${params.q}` : ''}`,
        params
      ),
    getOptions: (data) => {
      return data.variants.map((type: any) => {
        return {
          label: type.title + " - " + type.product.title,
          value: type.id,
          image: type.product?.thumbnail,
          price: type.calculated_price,
        }
      })
    },
  })


  return (
    <RouteFocusModal>
      <KeyboundForm
        hidden={true}
        className="flex h-full flex-col"
        onSubmit={props.form.handleSubmit(props.onSubmit)}
      >
        <ProgressTabs
          value={tab}
          onValueChange={(v) => handleTabChange(v as QuoteCreateTab)}
          className="flex h-full flex-col overflow-hidden"
        >
          <RouteFocusModal.Header>
            <div className="flex w-full items-center justify-between gap-x-4">
              <div className="-my-2 w-full max-w-[600px] border-l">
                <ProgressTabs.List className="grid w-full grid-cols-4">
                  <ProgressTabs.Trigger
                    className="w-full"
                    value={QuoteCreateTab.QUOTE_CREATE}
                    status={tabState[QuoteCreateTab.QUOTE_CREATE]}
                  >
                    Quote
                  </ProgressTabs.Trigger>
                </ProgressTabs.List>
              </div>
            </div>
          </RouteFocusModal.Header>
          <RouteFocusModal.Body className="size-full overflow-hidden">
            <ProgressTabs.Content
              value={QuoteCreateTab.QUOTE_CREATE}
              className="flex h-full flex-col items-center overflow-y-auto"
            >
              <div className="flex w-full max-w-5xl flex-col gap-4 p-16">
                {/* Region Selection */}
                <Controller
                  control={props.form.control}
                  name="region_id"
                  rules={{ required: "Region is required" }}
                  render={({ field }) => {
                    return (
                      <div>
                        <Label>Region</Label>
                        <Combobox
                          {...field}
                          options={region.options}
                          searchValue={region.searchValue}
                          onSearchValueChange={region.onSearchValueChange}
                          fetchNextPage={region.fetchNextPage}
                          onChange={(e) => {
                            const selectedRegion = region.options.find(
                              (option) => option.value === e
                            )
                            const newCurrencyCode =
                              (selectedRegion as any)?.currency_code || ""
                            setCurrencyCode(newCurrencyCode)

                            // Clear all variant selections when region changes
                            fields.forEach((_, index) => {
                              props.form.setValue(`variants.${index}.variant_id`, "")
                              props.form.setValue(`variants.${index}.unit_price`, "")
                            })
                            setPrices({})

                            field.onChange(e)
                          }}
                        />
                        <ErrorMessage
                          control={props.form.control}
                          name={field.name}
                          rules={{ required: "Region is required" }}
                        />
                      </div>
                    )
                  }}
                />

                {/* Customer Selection */}
                <Controller
                  control={props.form.control}
                  name="customer_id"
                  rules={{ required: "Customer is required" }}
                  render={({ field }) => {
                    return (
                      <div>
                        <div className="flex items-center justify-between pb-1">
                          <Label>Customer</Label>
                          {customer.searchValue &&
                            !customer.options.some(
                              (opt) =>
                                opt.label.toLowerCase() ===
                                customer.searchValue.toLowerCase()
                            ) && (
                              <div
                                className="text-ui-fg-base mt-2 cursor-pointer text-sm"
                                onClick={() => setShowCustomerModal(true)}
                              >
                                <div className="flex items-center gap-x-1">
                                  <Plus className="h-4 w-4" />
                                  <span>Create New Customer</span>
                                </div>
                              </div>
                            )}
                        </div>
                        <Combobox
                          {...field}
                          options={customer.options}
                          searchValue={customer.searchValue}
                          onSearchValueChange={customer.onSearchValueChange}
                          fetchNextPage={customer.fetchNextPage}
                        />
                        <ErrorMessage
                          control={props.form.control}
                          name={field.name}
                          rules={{ required: "Customer is required" }}
                        />
                      </div>
                    )
                  }}
                />

                {/* Dynamic Variants Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">Product Variants</Label>
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={addVariant}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Variant
                    </Button>
                  </div>

                  {fields.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-ui-border-base rounded-lg">
                      <p className="text-ui-fg-muted mb-4">No additional variants added</p>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addVariant}
                        className="flex items-center gap-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        Add First Variant
                      </Button>
                    </div>
                  ) : (
                    fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-4 border border-ui-border-base rounded-lg space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Variant {index + 1}</h4>
                          <Button
                            type="button"
                            variant="transparent"
                            size="small"
                            onClick={() => removeVariant(index)}
                            disabled={fields.length === 1}
                            className={`${fields.length === 1
                              ? 'text-ui-fg-disabled cursor-not-allowed'
                              : 'text-ui-fg-error hover:text-ui-fg-error-hover'
                              }`}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          {/* Variant Selection */}
                          <div className="lg:col-span-2">
                            <Controller
                              control={props.form.control}
                              name={`variants.${index}.variant_id`}
                              rules={{ required: "Variant is required" }}
                              render={({ field }) => (
                                <div>
                                  <Label>Product Variant</Label>
                                  <Combobox
                                    {...field}
                                    options={variant.options}
                                    searchValue={variant.searchValue}
                                    onSearchValueChange={variant.onSearchValueChange}
                                    fetchNextPage={variant.fetchNextPage}
                                    onChange={(e) => {
                                      const selectedVariant = variant.options.find(
                                        (option: any) => option.value === e
                                      )

                                      const calculatedPrice = (selectedVariant as any)?.price
                                        ?.calculated_amount || ""

                                      updatePrice(index, calculatedPrice)

                                      // Auto-fill unit price with calculated price
                                      props.form.setValue(`variants.${index}.unit_price`, calculatedPrice)

                                      field.onChange(e)
                                    }}
                                  />
                                  <ErrorMessage
                                    control={props.form.control}
                                    name={`variants.${index}.variant_id`}
                                    rules={{ required: "Variant is required" }}
                                  />
                                </div>
                              )}
                            />
                          </div>

                          {/* Quantity */}
                          <div>
                            <Controller
                              control={props.form.control}
                              name={`variants.${index}.quantity`}
                              rules={{
                                required: "Quantity is required",
                                min: { value: 1, message: "Minimum quantity is 1" }
                              }}
                              render={({ field }) => (
                                <div>
                                  <Label>Quantity</Label>
                                  <Input
                                    type="number"
                                    {...field}
                                    placeholder="Enter quantity"
                                    className="w-full"
                                    min={1}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value) || ""
                                      field.onChange(value)
                                    }}
                                  />
                                  <ErrorMessage
                                    control={props.form.control}
                                    name={`variants.${index}.quantity`}
                                    rules={{
                                      required: "Quantity is required",
                                      min: { value: 1, message: "Minimum quantity is 1" }
                                    }}
                                  />
                                </div>
                              )}
                            />
                          </div>
                        </div>

                        {/* Unit Price - Full Width */}
                        <div className="mt-4">
                          <Controller
                            control={props.form.control}
                            name={`variants.${index}.unit_price`}
                            rules={{ required: "Unit price is required" }}
                            render={({ field }) => (
                              <div>
                                <div className="flex items-center justify-between pb-1">
                                  <Label>Unit Price</Label>
                                  {prices[`variant_${index}`] && (
                                    <Label className="text-xs text-ui-fg-muted">
                                      Calculated: {prices[`variant_${index}`]} {currencyCode.toUpperCase()}
                                    </Label>
                                  )}
                                </div>
                                <CurrencyInput
                                  symbol={currencyCode}
                                  code={currencyCode}
                                  type="numeric"
                                  min={0}
                                  style={{ textAlign: "left" }}
                                  onChange={(e) => {
                                    const raw = e.target.value.replace(/,/g, "")
                                    const numericValue = Number(raw)
                                    if (!isNaN(numericValue)) {
                                      field.onChange(numericValue)
                                    } else {
                                      field.onChange("")
                                    }
                                  }}
                                  className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover w-full"
                                />
                                <ErrorMessage
                                  control={props.form.control}
                                  name={`variants.${index}.unit_price`}
                                  rules={{ required: "Unit price is required" }}
                                />
                              </div>
                            )}
                          />
                        </div>

                      </div>
                    ))
                  )}


                </div>

                {/* Promotion Selection */}
                <Controller
                  control={props.form.control}
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
                          onChange={(e) => {
                            field.onChange(e)
                          }}
                        />
                      </div>
                    )
                  }}
                />

                {/* Valid Till Date */}
                <Controller
                  control={props.form.control}
                  name="valid_till"
                  rules={{ required: "valid till is required" }}
                  render={({ field }) => {
                    return (
                      <div>
                        <Label>Valid Till</Label>
                        <DatePicker
                          granularity="minute"
                          shouldCloseOnSelect={false}
                          minValue={new Date()}
                          {...field}
                        />
                        <ErrorMessage
                          control={props.form.control}
                          name={field.name}
                          rules={{ required: "valid till is required" }}
                        />
                      </div>
                    )
                  }}
                />

                <CustomerCreateModal
                  open={showCustomerModal}
                  onOpenChange={setShowCustomerModal}
                  defaultEmail={customer.searchValue}
                  onCreate={(newCustomer) => {
                    setCustomerKey((prev) => prev + 1)
                    customer.refetch?.()
                    props.form.setValue("customer_id", newCustomer.id)
                  }}
                />
              </div>
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
        </ProgressTabs>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                Cancel
              </Button>
            </RouteFocusModal.Close>

            <Button
              key="continue-btn"
              type="button"
              onClick={handleContinue}
              size="small"
            >
              {props.form.formState.isSubmitting ? (
                <Spinner className="animate-spin" />
              ) : (
                "Create Quote"
              )}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal>
  )
}

export default QuoteCreateForm