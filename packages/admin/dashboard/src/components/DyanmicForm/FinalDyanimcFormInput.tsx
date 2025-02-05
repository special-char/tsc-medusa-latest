import { useController } from "react-hook-form"
import { Label, Input } from "@medusajs/ui"
import { ErrorMessage } from "@hookform/error-message"

const FinalDyanimcFormInput = ({
  name,
  label,
  ...props
}: {
  name: string
  label: String
}) => {
  const { field } = useController({
    name,
    ...props,
  })
  return (
    <div>
      <Label>{label}</Label>
      <Input {...field} />
      <ErrorMessage name={name} />
    </div>
  )
}

export default FinalDyanimcFormInput
