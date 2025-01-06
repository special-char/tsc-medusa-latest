import { Select } from "@medusajs/ui"
import { useSalesChannels } from "../../../../hooks/api"
import { AdminSalesChannel } from "@medusajs/types"

type Props = {
  onChange: (value: AdminSalesChannel | undefined) => void
}

const SelectSalesChannel = (props: Props) => {
  const { sales_channels } = useSalesChannels()

  const handleCurrencyChange = (value: string) => {
    props.onChange(sales_channels?.find((x) => x.id === value))
  }

  return (
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
  )
}

export default SelectSalesChannel
