import { clx } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useCombinedRefs } from "../../../../hooks/use-combined-refs"
import {
  useDataGridCell,
  useDataGridCellError,
} from "../../../../components/data-grid/hooks"
import { DataGridCellProps } from "../../../../components/data-grid/types"
import { DataGridCellContainer } from "../../../../components/data-grid/components/data-grid-cell-container"
import { HttpTypes } from "@medusajs/types"

type SyncedQuantityCellProps = DataGridCellProps & {
  variant: HttpTypes.AdminProductVariant
  currencies: HttpTypes.AdminStoreCurrency[]
  regions: HttpTypes.AdminRegion[]
  quantityField: "min_quantity" | "max_quantity"
}

export const SyncedQuantityCell = ({
  context,
  variant,
  currencies,
  regions,
  quantityField,
}: SyncedQuantityCellProps) => {
  const { field, control, renderProps } = useDataGridCell({ context })
  const errorProps = useDataGridCellError({ context })
  const { setValue } = useFormContext()

  const { container, input } = renderProps

  return (
    <Controller
      control={control}
      name={field}
      render={({ field: fieldProps }) => {
        return (
          <DataGridCellContainer {...container} {...errorProps}>
            <Inner
              field={fieldProps}
              inputProps={input}
              variant={variant}
              currencies={currencies}
              regions={regions}
              quantityField={quantityField}
              setValue={setValue}
            />
          </DataGridCellContainer>
        )
      }}
    />
  )
}

const Inner = ({
  field,
  inputProps,
  variant,
  currencies,
  regions,
  quantityField,
  setValue,
}: any) => {
  const { ref, value, onChange: _, onBlur, ...fieldProps } = field
  const {
    ref: inputRef,
    onChange,
    onBlur: onInputBlur,
    onFocus,
    ...attributes
  } = inputProps

  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const combinedRefs = useCombinedRefs(inputRef, ref)

  const handleBlur = () => {
    onBlur()
    onInputBlur()

    // Sync the value to ALL currency and region prices for this variant
    const newValue =
      localValue === "" || localValue === null || localValue === undefined
        ? null
        : localValue

    // Update all currency prices
    currencies.forEach((currency: HttpTypes.AdminStoreCurrency) => {
      const path = `products.${variant.product_id}.variants.${variant.id}.currency_prices.${currency.currency_code}.${quantityField}`
      setValue(path, newValue, { shouldDirty: true })
    })

    // Update all region prices
    regions.forEach((region: HttpTypes.AdminRegion) => {
      const path = `products.${variant.product_id}.variants.${variant.id}.region_prices.${region.id}.${quantityField}`
      setValue(path, newValue, { shouldDirty: true })
    })

    // Propagate change to the original field
    onChange(newValue, value)
  }

  return (
    <div className="size-full">
      <input
        ref={combinedRefs}
        value={localValue ?? ""}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onFocus={onFocus}
        type="number"
        inputMode="decimal"
        className={clx(
          "txt-compact-small size-full bg-transparent outline-none",
          "placeholder:text-ui-fg-muted"
        )}
        tabIndex={-1}
        {...fieldProps}
        {...attributes}
      />
    </div>
  )
}
