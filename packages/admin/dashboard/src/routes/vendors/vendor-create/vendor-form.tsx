import { Input, Label, Text } from "@medusajs/ui"
import React, { HTMLAttributes } from "react"
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form"
type Fields = {
  name: string
  label: string
  placeholder: string
  inputType:
    | "search"
    | "text"
    | "none"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | undefined
  component?: React.DetailedReactHTMLElement<any, HTMLElement>
}
type Props = {
  fields: {
    merchant: Fields[]
    merchantAdmin: Fields[]
  }
  decendentField: "merchant" | "merchantAdmin"
  control: Control<FieldValues, any>
  errors: FieldErrors<FieldValues>
  className?: HTMLAttributes<HTMLDivElement>["className"]
}

const VendorForm = (props: Props) => {
  return (
    <div className={props.className}>
      {props?.fields?.[props.decendentField].map(
        ({ name, label, placeholder, inputType, component }) => {
          const Component = component
          return (
            <div key={name}>
              <Controller
                name={name}
                control={props.control}
                rules={{ required: `${name} is required` }}
                render={({ field }) => {
                  return (
                    <>
                      <Label>
                        <span>{label}</span>
                        {component ? (
                          <Component {...field} />
                        ) : (
                          <Input
                            inputMode={inputType}
                            placeholder={placeholder}
                            {...field}
                          />
                        )}
                      </Label>
                    </>
                  )
                }}
              />
              {props.errors.title && (
                <Text className="text-red-500">
                  {props.errors?.title?.message as string}
                </Text>
              )}
            </div>
          )
        }
      )}
    </div>
  )
}

export default VendorForm
