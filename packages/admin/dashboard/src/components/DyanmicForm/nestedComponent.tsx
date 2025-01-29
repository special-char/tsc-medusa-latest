import { Control, FieldValues, useFieldArray } from "react-hook-form"

type Props = {
  control: Control<FieldValues, any>
  name: string
  schema: any
}

const nestedComponent = ({ control, name, schema }: Props) => {
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "test",
    }
  )
  return <div>nestedComponent</div>
}

export default nestedComponent
