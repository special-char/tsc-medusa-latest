import { IconButton, Label, Button } from "@medusajs/ui"
import { Plus, Trash } from "@medusajs/icons"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import ErrorMessage from "./DynamicForm/ErrorMessage"
import { useEffect } from "react"
import { useStore } from "../../../../hooks/api"
import PriceFormInput from "./PriceFormInput"

const AddDenomination = () => {
  const { store } = useStore()
  const { control } = useFormContext()

  const defaultCurrency = store?.supported_currencies.find((c) => c.is_default)

  const { fields, append, remove } = useFieldArray({
    control,
    name: "denominations",
  })

  useEffect(() => {
    if (fields.length === 0 && defaultCurrency) {
      append({
        amount: null,
        currency: defaultCurrency.currency_code,
      })
    }
  }, [append, defaultCurrency, fields.length])

  return (
    <div className="pt-4">
      {fields.map((denomination, index) => {
        return (
          <div key={denomination.id} className="flex  gap-4">
            <div className="bg-grey-5 border-gray-20 p-2 rounded-md flex h-10 w-[100px] items-center border uppercase">
              {defaultCurrency?.currency_code}
            </div>
            <div className="flex items-center mb-4 gap-4">
              <div>
                <Controller
                  control={control}
                  name={`denominations.${index}.amount`}
                  rules={{
                    validate: (value) => {
                      return value > 0
                    },
                  }}
                  render={({
                    field: { value, onChange, name },
                    fieldState: { error },
                  }) => {
                    return (
                      <>
                        <PriceFormInput
                          onChange={onChange}
                          amount={value !== null ? value : undefined}
                          currencyCode={defaultCurrency?.currency_code || ""}
                        />
                        <ErrorMessage
                          name={name}
                          rules={{
                            required: "An amount is required",
                          }}
                          control={control as any}
                        />
                      </>
                    )
                  }}
                />
              </div>
            </div>
            <IconButton onClick={() => remove(index)} className="h-10 w-10">
              <Trash className="text-rose-600" />
            </IconButton>
          </div>
        )
      })}
      <Button
        onClick={() =>
          append({
            amount: null,
            currency: defaultCurrency?.currency_code || "USD",
          })
        }
        variant="transparent"
        className="flex items-center gap-2"
        type="button"
      >
        <Plus />
        <Label className="font-medium font-sans">Add Denomination</Label>
      </Button>
    </div>
  )
}

export default AddDenomination
