import { Input, Label, Text } from "@medusajs/ui"
import React, { HTMLAttributes } from "react"
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  RegisterOptions,
} from "react-hook-form"
type Fields = {
  name: string
  label: string
  placeholder: string
  type?: React.HTMLInputTypeAttribute | undefined
  component?: React.DetailedReactHTMLElement<any, HTMLElement>
  rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
      >
    | undefined
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
        ({ name, label, placeholder, type, component, rules }) => {
          const Component = component
          return (
            <div key={name}>
              <Controller
                name={name}
                control={props.control}
                rules={rules}
                render={({ field }) => {
                  return (
                    <>
                      <Label>
                        <span>{label}</span>
                        {component ? (
                          <Component {...field} />
                        ) : (
                          <Input
                            {...field}
                            type={type}
                            placeholder={placeholder}
                          />
                        )}
                      </Label>
                    </>
                  )
                }}
              />
              {props.errors?.[name] && (
                <Text className="text-red-500">
                  {props.errors[name]?.message as string}
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
