import {
  Combobox as PrimitiveCombobox,
  ComboboxDisclosure as PrimitiveComboboxDisclosure,
  ComboboxItem as PrimitiveComboboxItem,
  ComboboxPopover as PrimitiveComboboxPopover,
  ComboboxProvider as PrimitiveComboboxProvider,
} from "@ariakit/react"
import { clx } from "@medusajs/ui"
import { matchSorter } from "match-sorter"
import React, { ForwardedRef, useEffect, useMemo, useState } from "react"

type ComboboxOption = {
  value: string
  label: string
  disabled?: boolean
}

type ComboboxProps = {
  value?: string
  onChange?: (value: string | undefined) => void
  options: ComboboxOption[]
  placeholder?: string
  className?: any
}

const CustomSearchableSelect = React.forwardRef(
  (
    {
      value,
      onChange,
      options,
      placeholder = "Search...",
      className,
    }: ComboboxProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [searchValue, setSearchValue] = useState(value || "")
    const [open, setOpen] = useState(false)

    useEffect(() => {
      setSearchValue(value || "")
    }, [value])

    const trimmedSearchValue = searchValue.trim()

    const filteredOptions = useMemo(() => {
      return matchSorter(options, trimmedSearchValue, { keys: ["label"] })
    }, [options, trimmedSearchValue])

    const handleValueChange = (selectedValue: string) => {
      onChange?.(selectedValue)
      setSearchValue(selectedValue)
      setOpen(false)
    }

    return (
      <PrimitiveComboboxProvider
        open={open}
        setOpen={setOpen}
        value={searchValue}
        setValue={setSearchValue}
      >
        <div
          className={clx(
            "relative flex cursor-pointer items-center gap-x-2 overflow-hidden",
            "h-8 w-full rounded-md",
            "bg-ui-bg-field transition-fg shadow-borders-base",
            "has-[input:focus]:shadow-borders-interactive-with-active",
            "has-[:invalid]:shadow-borders-error has-[[aria-invalid=true]]:shadow-borders-error",
            "has-[:disabled]:bg-ui-bg-disabled has-[:disabled]:text-ui-fg-disabled has-[:disabled]:cursor-not-allowed",
            className
          )}
        >
          <PrimitiveCombobox
            ref={ref}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="txt-compact-small text-ui-fg-base !placeholder:text-ui-fg-muted transition-fg size-full cursor-pointer bg-transparent pl-2 pr-8 outline-none focus:cursor-text"
          />
          <PrimitiveComboboxDisclosure className="absolute right-2" />
        </div>
        <PrimitiveComboboxPopover
          gutter={4}
          sameWidth
          role="listbox"
          className="shadow-elevation-flyout bg-ui-bg-base data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-10 max-h-52 overflow-y-auto"
        >
          {filteredOptions.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">No options found</div>
          ) : (
            filteredOptions.map(({ value: optValue, label, disabled }) => (
              <PrimitiveComboboxItem
                focusOnHover
                key={optValue}
                value={optValue}
                disabled={disabled}
                onClick={() => handleValueChange(optValue)}
                className="transition-fg bg-ui-bg-base data-[active-item=true]:bg-ui-bg-base-hover group flex cursor-pointer items-center gap-x-2 rounded-[4px] px-2 py-1 text-sm"
              >
                {label}
              </PrimitiveComboboxItem>
            ))
          )}
        </PrimitiveComboboxPopover>
      </PrimitiveComboboxProvider>
    )
  }
)

CustomSearchableSelect.displayName = "CustomSearchableSelect"

export default CustomSearchableSelect
