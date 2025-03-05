import { Select } from "@medusajs/ui"
import { Dispatch, SetStateAction } from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"
import { Event } from "../../../notification-template-list/components/notification-template-list-table"

type Props = {
  field: ControllerRenderProps<FieldValues, string>
  setTags?: Dispatch<SetStateAction<Record<string, any> | undefined>>
  eventList?: Event[]
  formField: {
    name: string
    label: string
    type: string
    required: boolean
    props?: Record<string, any>
  }
}

const EventSelect = ({ field, setTags, eventList, formField }: Props) => {
  return (
    <Select
      onValueChange={(v) => {
        field.onChange(v)
        if (setTags) {
          setTags(eventList?.find((item) => item?.id === v)?.tags)
        }
      }}
    >
      <Select.Trigger>
        <Select.Value placeholder={`Select an ${formField.label}`} />
      </Select.Trigger>
      <Select.Content>
        {eventList?.map((item) => (
          <Select.Item key={item?.id} value={item?.id}>
            {item?.eventName}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  )
}

export default EventSelect
