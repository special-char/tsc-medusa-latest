import { useCallback, useEffect, useState } from "react"
import AmountField from "react-currency-input-field"
import clsx from "clsx"
import { Label } from "@medusajs/ui"
import { currencies } from "../../../../lib/data/currencies"

type Props = {
  currencyCode: string
  amount?: number | null
  onChange: (amount?: number | null) => void
  errors?: { [x: string]: unknown }
  name?: string
  label?: string
  required?: boolean
}

const PriceFormInput = ({
  name,
  currencyCode,
  errors,
  amount,
  onChange,
  label,
  required,
}: Props) => {
  const { symbol_native, decimal_digits } =
    currencies?.[currencyCode?.toUpperCase()]

  const getFormattedValue = useCallback(
    (value: number) => {
      return `${value / 10 ** decimal_digits}`
    },
    [decimal_digits]
  )

  const [formattedValue, setFormattedValue] = useState<string | undefined>(
    amount !== null && amount !== undefined
      ? getFormattedValue(amount)
      : undefined
  )

  useEffect(() => {
    if (amount) {
      setFormattedValue(getFormattedValue(amount))
    }
  }, [amount, decimal_digits, getFormattedValue])

  const onAmountChange = (value?: string, floatValue?: number | null) => {
    if (typeof floatValue === "number") {
      const numericalValue = Math.round(floatValue * 10 ** decimal_digits)
      onChange(numericalValue)
    } else {
      onChange(null)
    }
    setFormattedValue(value)
  }

  const step = 10 ** -decimal_digits

  return (
    <div>
      {label && <Label {...{ label, required }} className="mb-xsmall" />}
      <div
        className={clsx(
          "bg-grey-5 border-gray-20 flex h-10 w-full items-center rounded-md border p-2",
          {
            "border-rose-50": errors && name && errors[name],
          }
        )}
      >
        <span className="inter-base-regular text-grey-40">{symbol_native}</span>

        <AmountField
          step={step}
          value={formattedValue}
          onValueChange={(value, _name, values) =>
            onAmountChange(value, values?.float)
          }
          allowNegativeValue={false}
          placeholder="-"
          decimalScale={decimal_digits}
          className="remove-number-spinner leading-base text-grey-90 caret-violet-60 placeholder-grey-40 w-full bg-transparent text-right font-normal outline-none outline-0"
        />
      </div>
      {/* <InputError name={name} errors={errors} /> */}
    </div>
  )
}

export default PriceFormInput
