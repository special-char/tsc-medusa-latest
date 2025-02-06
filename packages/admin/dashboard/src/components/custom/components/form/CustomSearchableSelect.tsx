import React, {
  ForwardedRef,
  useMemo,
  useState,
  useDeferredValue,
  useCallback,
  useEffect,
} from "react"
import {
  Combobox as PrimitiveCombobox,
  ComboboxDisclosure as PrimitiveComboboxDisclosure,
  ComboboxItem as PrimitiveComboboxItem,
  ComboboxPopover as PrimitiveComboboxPopover,
  ComboboxProvider as PrimitiveComboboxProvider,
} from "@ariakit/react"
import { clx } from "@medusajs/ui"

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
  displayCount?: number
}

const CustomSearchableSelect = React.forwardRef(
  (
    {
      value,
      onChange,
      options,
      placeholder = "Search...",
      displayCount = 100,
      className,
    }: ComboboxProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [searchValue, setSearchValue] = useState(value || "")
    const [open, setOpen] = useState(false)
    const [visibleOptions, setVisibleOptions] = useState<ComboboxOption[]>([])

    const deferredSearchValue = useDeferredValue(
      searchValue.trim().toLowerCase()
    )

    const filteredOptions = useMemo(() => {
      if (!deferredSearchValue) {
        return options
      }
      return options
        .filter(({ label }) =>
          label.toLowerCase().includes(deferredSearchValue)
        )
        .sort((a, b) => {
          const aStarts = a.label.toLowerCase().startsWith(deferredSearchValue)
          const bStarts = b.label.toLowerCase().startsWith(deferredSearchValue)
          return aStarts === bStarts ? 0 : aStarts ? -1 : 1
        })
    }, [options, deferredSearchValue])

    useEffect(() => {
      setVisibleOptions(filteredOptions.slice(0, displayCount))
    }, [filteredOptions])

    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement
        const bottom =
          target.scrollHeight - target.scrollTop === target.clientHeight

        if (bottom && visibleOptions.length < filteredOptions.length) {
          setVisibleOptions((prev) => [
            ...prev,
            ...filteredOptions.slice(prev.length, prev.length + displayCount),
          ])
        }
      },
      [filteredOptions, visibleOptions]
    )

    const handleValueChange = useCallback(
      (selectedValue: string) => {
        onChange?.(selectedValue)
        setSearchValue(selectedValue)
        setOpen(false)
      },
      [onChange]
    )

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
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="txt-compact-small text-ui-fg-base !placeholder:text-ui-fg-muted transition-fg size-full cursor-pointer bg-transparent pl-2 pr-8 outline-none focus:cursor-text"
          />
          <PrimitiveComboboxDisclosure className="absolute right-2" />
        </div>
        <PrimitiveComboboxPopover
          gutter={4}
          sameWidth
          role="listbox"
          className="shadow-elevation-flyout bg-ui-bg-base z-10"
        >
          <div
            onScroll={handleScroll}
            style={{ height: "200px" }}
            className="overflow-y-auto"
          >
            {visibleOptions.length === 0 ? (
              <div className="flex h-full items-center justify-center p-2 text-gray-500">
                No options found
              </div>
            ) : (
              <div>
                {visibleOptions.map(({ value: optValue, label, disabled }) => (
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
                ))}
              </div>
            )}
          </div>
        </PrimitiveComboboxPopover>
      </PrimitiveComboboxProvider>
    )
  }
)

CustomSearchableSelect.displayName = "CustomSearchableSelect"

export default CustomSearchableSelect
