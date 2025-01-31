import { Checkbox, Text } from "@medusajs/ui"
import { useSalesChannels } from "../../../../hooks/api"
import { AdminSalesChannel } from "@medusajs/types"
import { getSalesChannelIds } from "../../../../const/get-sales-channel"

type Props = {
  onChange: (value: AdminSalesChannel[]) => void
  value: AdminSalesChannel[] | null
}

const SelectSalesChannel = (props: Props) => {
  const salesChannelIds = getSalesChannelIds()

  const { sales_channels } = useSalesChannels({
    ...(salesChannelIds && salesChannelIds[0] && salesChannelIds[0].length !== 0
      ? { id: salesChannelIds[0] }
      : {}),
  })

  const handleCurrencyChange = (value: AdminSalesChannel) => {
    const newValue = Array.isArray(props.value)
      ? props.value.find((x) => x.id === value.id)
        ? props.value?.filter((x) => x.id !== value.id)
        : [...props.value, value]
      : [value]

    props.onChange(newValue)
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {sales_channels?.map((item) => (
        <div key={item.id} className="flex gap-4">
          <Checkbox
            onCheckedChange={() => {
              handleCurrencyChange(item)
            }}
          />
          <Text>{item.name}</Text>
        </div>
      ))}
    </div>
  )
}

export default SelectSalesChannel
