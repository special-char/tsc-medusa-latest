import React from "react"
import { useForm } from "react-hook-form"
import FinalDyanimcFormInput from "./FinalDyanimcFormInput"
import nestedComponent from "./nestedComponent"

type Props = { onSubmit: any }

const schema = [
  {
    name: "abcd",
    component: FinalDyanimcFormInput,
    label: "Abcd",
    clasName: "col-span-full",
  },
  {
    name: "pqr",
    componet: nestedComponent,
    label: "asdfdsaf",
    schema: [],
  },
]

const FinalDynamicForm = ({ onSubmit }: Props) => {
  const methods = useForm()
  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className="grid grid-cols-2"
    >
      {schema.map(({ component, ...x }) => {
        React.createElement(component, {
          ...x,
          control: methods.control,
        })
      })}
    </form>
  )
}

export default FinalDynamicForm
