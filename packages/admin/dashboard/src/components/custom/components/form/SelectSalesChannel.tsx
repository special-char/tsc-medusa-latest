import { Select } from "@medusajs/ui"
import { useSalesChannels } from "../../../../hooks/api"

type Props = {
  onChange: (value: string) => void
}

const SelectSalesChannel = (props: Props) => {
  const { sales_channels } = useSalesChannels()

  const handleCurrencyChange = (value: string) => {
    props.onChange(value)
  }

  return (
    <div>
      <Select onValueChange={handleCurrencyChange}>
        <Select.Trigger>
          <Select.Value placeholder="Select a Sales Channel" />
        </Select.Trigger>
        <Select.Content>
          {sales_channels?.map((channel) => (
            <Select.Item key={channel.id} value={channel.id}>
              {channel.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}

export default SelectSalesChannel
