import { Select } from "@medusajs/ui"

import { countries } from "../../../lib/data/countries"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

type Props = ControllerRenderProps<FieldValues, string>

const SelectCountry = (props: Props) => {
  return (
    <div>
      <label htmlFor=""></label>
      <Select value={props.value} onValueChange={props.onChange}>
        <Select.Trigger>
          <Select.Value placeholder="Select a country">
            {props.value || "Select a country"}
          </Select.Value>
        </Select.Trigger>
        <Select.Content>
          {countries.map((item) => (
            <Select.Item key={item.name} value={item.name}>
              {item.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}

export default SelectCountry
