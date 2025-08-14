import { Button, CurrencyInput, Input, Label } from "@medusajs/ui"
import { Controller, useFormContext } from "react-hook-form"
import { Trash } from "@medusajs/icons"
import { useState } from "react"
import { useComboboxData } from "../../hooks/use-combobox-data"
import { sdk } from "../../lib/client"
import { Combobox } from "../inputs/combobox"
import ErrorMessage from "../custom/components/form/DynamicForm/ErrorMessage"

type AddVariantSectionProps = {
    index: number
    currencyCode: string
    regionId: string | null
    onRemove: () => void
    canRemove: boolean
    existingVariantIds: string[]
}

export function AddVariantSection({
    index,
    currencyCode,
    regionId,
    onRemove,
    canRemove,
    existingVariantIds
}: AddVariantSectionProps) {
    const { control, setValue, watch } = useFormContext()
    const [calculatedPrice, setCalculatedPrice] = useState<string>("")


    const variant = useComboboxData({
        queryKey: ["variant", regionId],
        queryFn: (params: any) =>
            sdk.client.fetch<any>(
                `admin/product-variant?region_id=${regionId}&fields=*variants.calculated_price${params.q ? `&q=${params.q}` : ''}`,
                params
            ),
        getOptions: (data) => {
            return data.variants
                .filter((type: any) => !existingVariantIds.includes(type.id))
                .map((type: any) => {
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
        <div className="bg-ui-bg-subtle shadow-elevation-card-rest my-2 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">New Variant {index + 1}</h4>
                {canRemove && (
                    <Button
                        type="button"
                        variant="transparent"
                        size="small"
                        onClick={onRemove}
                        className="text-ui-fg-error hover:text-ui-fg-error-hover"
                    >
                        <Trash className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Variant Selection */}
                <div className="lg:col-span-2">
                    <Controller
                        control={control}
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

                                        const calculatedAmount = (selectedVariant as any)?.price
                                            ?.calculated_amount || ""

                                        setCalculatedPrice(calculatedAmount)

                                        // Auto-fill unit price with calculated price
                                        if (calculatedAmount) {
                                            setValue(`variants.${index}.unit_price`, calculatedAmount)
                                        }

                                        field.onChange(e)
                                    }}
                                />
                                <ErrorMessage
                                    control={control}
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
                        control={control}
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
                                    control={control}
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
                    control={control}
                    name={`variants.${index}.unit_price`}
                    rules={{ required: "Unit price is required" }}
                    render={({ field }) => (
                        <div>
                            <div className="flex items-center justify-between pb-1">
                                <Label>Unit Price</Label>
                                {calculatedPrice && (
                                    <Label className="text-xs text-ui-fg-muted">
                                        Calculated: {calculatedPrice} {currencyCode.toUpperCase()}
                                    </Label>
                                )}
                            </div>
                            <CurrencyInput
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
                                className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover w-full"
                            />
                            <ErrorMessage
                                control={control}
                                name={`variants.${index}.unit_price`}
                                rules={{ required: "Unit price is required" }}
                            />
                        </div>
                    )}
                />
            </div>
        </div>
    )
}