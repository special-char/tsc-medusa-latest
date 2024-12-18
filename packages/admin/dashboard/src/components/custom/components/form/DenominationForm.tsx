import { InformationCircle } from "@medusajs/icons"
import { Controller, useFieldArray, useWatch } from "react-hook-form"
import { Alert, Heading, Switch } from "@medusajs/ui"
import ErrorMessage from "./DynamicForm/ErrorMessage"
import PriceFormInput from "./PriceFormInput"
import { NestedForm } from "../../../../lib/nested-form"
import { currencies } from "../../../../lib/data/currencies"

type Props = {
  form: NestedForm<DenominationFormType>
}

type DenominationType = {
  amount: number
  currency_code: string
  includes_tax?: boolean
}

export type DenominationFormType = {
  defaultDenomination: DenominationType
  currencyDenominations: DenominationType[]
  useSameValue: boolean
}

const DenominationForm = ({ form }: Props) => {
  const {
    control,
    path,
    formState: { errors },
  } = form

  const { fields } = useFieldArray({
    control,
    name: path("currencyDenominations"),
    keyName: "fieldKey",
  })

  const defaultCurrency = useWatch({
    control,
    name: path("defaultDenomination"),
  })

  const useSameValue = useWatch({
    control,
    name: path("useSameValue"),
  })

  return (
    <div className="gap-y-8 flex flex-col px-4">
      <Heading level="h1">Add Denomination</Heading>
      <div>
        <div className="gap-x-2 flex items-center">
          <h2>Default currency</h2>
          <InformationCircle />
        </div>
        <div className="rounded-rounded relative flex justify-between transition-colors">
          <div className="gap-x-2 flex items-center">
            <div className="gap-x-4 flex items-center">
              <span>{defaultCurrency.currency_code.toUpperCase()}</span>
              <span className="text-grey-50">
                {currencies[defaultCurrency.currency_code.toUpperCase()].name}
              </span>
            </div>
          </div>
          <Controller
            name={path(`defaultDenomination.amount`)}
            control={control}
            render={({ field: { value, onChange, name } }) => {
              return (
                <div className="flex flex-col">
                  <PriceFormInput
                    onChange={onChange}
                    amount={value !== null ? value : undefined}
                    currencyCode={defaultCurrency.currency_code}
                    errors={errors}
                  />
                  <ErrorMessage
                    name={name}
                    rules={{
                      required: "An amount is required",
                    }}
                    control={control as any}
                  />
                </div>
              )
            }}
          />
        </div>
      </div>
      <hr className="my-2 border-gray-300" />
      <div className="grid grid-cols-[70%_1fr]">
        <div className="gap-y-2">
          <h2 className="inter-base-semibold">Use value for all currencies?</h2>
          <p className="inter-small-regular text-grey-50 ">
            If enabled the value used for the store&apos;s default currency code
            will also be applied to all other currencies in your store.
          </p>
        </div>
        <div className="flex justify-end">
          <Controller
            control={control}
            name={path("useSameValue")}
            render={({ field: { value, onChange, ...rest } }) => {
              return (
                <Switch
                  checked={value}
                  onCheckedChange={onChange}
                  {...rest}
                  disabled={fields.length == 0}
                />
              )
            }}
          />
        </div>
      </div>
      <hr className="my-2 border-gray-300" />
      {!useSameValue && (
        <div>
          <div className="gap-x-2 flex items-center py-4">
            <h2 className="inter-base-semibold">Other currencies</h2>
            <InformationCircle />
          </div>
          {fields.length === 0 ? (
            <Alert
              variant="warning"
              className="bg-yellow-50 border border-yellow-200 p-4 rounded-md flex items-center space-x-3"
            >
              <h3 className="font-medium text-yellow-800">
                No Additional Currencies
              </h3>
              <p className="text-yellow-700 text-sm">
                To use additional currencies, please add more currencies to your
                store settings.
              </p>
            </Alert>
          ) : (
            <div className="gap-y-2 pt-small flex flex-col">
              {fields.map((denom, index) => {
                return (
                  <div
                    key={denom.fieldKey}
                    className="gap-x-base rounded-rounded relative grid grid-cols-[1fr_223px] justify-between transition-colors"
                  >
                    <div className="gap-x-4 flex items-center">
                      <div className="gap-x-4 flex items-center">
                        <span className="inter-base-semibold">
                          {denom.currency_code.toUpperCase()}
                        </span>
                        <span className="inter-base-regular text-grey-50">
                          {currencies[denom.currency_code.toUpperCase()].name}
                        </span>
                      </div>
                    </div>
                    <Controller
                      name={path(`currencyDenominations.${index}.amount`)}
                      control={control}
                      render={({
                        field: { value, onChange },
                        formState: { errors },
                      }) => {
                        return (
                          <PriceFormInput
                            onChange={onChange}
                            amount={value !== null ? value : undefined}
                            currencyCode={denom.currency_code}
                            errors={errors}
                          />
                        )
                      }}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DenominationForm
