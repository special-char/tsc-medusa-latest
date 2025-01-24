import { IconButton } from "@medusajs/ui"
import { XMark } from "@medusajs/icons"

type Props = {
  name: string
  placeholder?: string
  value: string
  onChange: (e: any) => void
  onRemove?: () => void
}

const CustomColorField = ({ name, value, onChange, onRemove }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <label
        className="transition-fg disabled:bg-ui-bg-disabled disabled:shadow-buttons-neutral disabled:text-ui-fg-disabled relative inline-flex h-8 w-16 items-center justify-center overflow-hidden rounded-md border outline-none disabled:after:hidden"
        style={{
          background:
            value && value != ""
              ? value
              : "linear-gradient(22.5deg, white 48%, red 48%, red 52%, white 52%)",
        }}
      >
        <input
          name={name}
          type="color"
          value={value || ""}
          onChange={onChange}
          className="invisible h-full w-full"
        />
      </label>
      <IconButton
        type="button"
        onClick={() => {
          onChange(null)
          if (onRemove) {
            onRemove()
          }
        }}
      >
        <XMark />
      </IconButton>
    </div>
  )
}

export default CustomColorField
