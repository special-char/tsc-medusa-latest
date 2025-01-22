import { IconButton, Label, Button, Select } from "@medusajs/ui"
import { Plus, Trash } from "@medusajs/icons"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import ErrorMessage from "./DynamicForm/ErrorMessage"
import { useEffect } from "react"
import { useStore } from "../../../../hooks/api"
import PriceFormInput from "./PriceFormInput"

const AddDenomination = () => {
  const { store } = useStore()
  const { control, watch } = useFormContext()

  const defaultCurrency = store?.supported_currencies.find((c) => c.is_default)
  const { fields, append, remove } = useFieldArray({
    control,
    name: "denominations",
  })

  useEffect(() => {
    if (fields.length === 0 && defaultCurrency) {
      append({
        amount: 1,
        currency: defaultCurrency.currency_code,
      })
    }
  }, [append, defaultCurrency, fields.length])

  return (
    <div className="pt-4">
      {fields.map((denomination, index) => {
        const currency = watch(`denominations.${index}.currency`)
        return (
          <div key={denomination.id} className="grid grid-cols-3 gap-2">
            <div className="flex h-10 min-w-max items-center ">
              <Controller
                control={control}
                name={`denominations.${index}.currency`}
                render={({ field: { value, onChange, name } }) => {
                  return (
                    <>
                      <Select name={name} onValueChange={onChange}>
                        <Select.Trigger>
                          <Select.Value
                            placeholder={defaultCurrency?.currency_code?.toUpperCase()}
                          >
                            {value.toUpperCase()}
                          </Select.Value>
                        </Select.Trigger>
                        <Select.Content>
                          {store?.supported_currencies?.map((item) => (
                            <Select.Item
                              key={item.id}
                              value={item.currency_code}
                            >
                              {item.currency_code.toUpperCase()}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </>
                  )
                }}
              />
            </div>
            <div className="mb-4 flex items-center gap-4">
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
                          currencyCode={
                            currency ??
                            (defaultCurrency?.currency_code as string)
                          }
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
        className="ml-2 flex items-center gap-2"
        type="button"
      >
        <Plus />
        <Label className="font-sans font-medium">Add Denomination</Label>
      </Button>
    </div>
  )
}

export default AddDenomination
