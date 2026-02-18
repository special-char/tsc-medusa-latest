import { Button, clx, Text } from "@medusajs/ui"
import {
  CheckMini,
  PlusMini,
  XMarkMini,
  MagnifyingGlassMini,
} from "@medusajs/icons"
import { Popover as RadixPopover } from "radix-ui"
import { Command } from "cmdk"
import { useState, useEffect, MouseEvent } from "react"
import { useTranslation } from "react-i18next"

const BATCH_SIZE = 50

// Re-implement FilterChip since it is not exported from @medusajs/ui
type FilterChipProps = {
  label: string
  value?: string
  onRemove: () => void
}

const FilterChip = ({ label, value, onRemove }: FilterChipProps) => {
  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onRemove()
  }

  return (
    <div className="bg-ui-bg-field transition-fg shadow-borders-base text-ui-fg-subtle flex cursor-default select-none items-stretch overflow-hidden rounded-md">
      <RadixPopover.Anchor />
      <div
        className={clx(
          "flex items-center justify-center whitespace-nowrap px-2 py-1",
          {
            "border-r": !!value,
          }
        )}
      >
        <Text size="small" weight="plus" leading="compact">
          {label}
        </Text>
      </div>
      <div className="flex w-full items-center overflow-hidden">
        {!!value && (
          <div className="border-r p-1 px-2">
            <Text
              size="small"
              weight="plus"
              leading="compact"
              className="text-ui-fg-muted"
            >
              is
            </Text>
          </div>
        )}
        {!!value && (
          <RadixPopover.Trigger
            asChild
            className={clx(
              "flex-1 cursor-pointer overflow-hidden border-r p-1 px-2",
              {
                "hover:bg-ui-bg-field-hover": true,
                "data-[state=open]:bg-ui-bg-field-hover": true,
              }
            )}
          >
            <Text
              size="small"
              leading="compact"
              weight="plus"
              className="truncate text-nowrap"
            >
              {value}
            </Text>
          </RadixPopover.Trigger>
        )}
      </div>
      {!!value && (
        <button
          onClick={handleRemove}
          className={clx(
            "text-ui-fg-muted transition-fg flex items-center justify-center p-1",
            "hover:bg-ui-bg-subtle-hover active:bg-ui-bg-subtle-pressed active:text-ui-fg-base"
          )}
        >
          <XMarkMini />
        </button>
      )}
    </div>
  )
}

type FilterOption = {
  label: string
  value: string
}

export type RestockFilterConfig = {
  key: string
  label: string
  options: FilterOption[]
  searchable?: boolean
  onSearch?: (query: string) => void
  hasMore?: boolean
  onLoadMore?: () => void
  isLoadingMore?: boolean
}

type RestockSubscriptionTableFiltersProps = {
  filters: RestockFilterConfig[]
  activeFilters: Record<string, string | undefined>
  onFilterChange: (key: string, value: string | undefined) => void
  searchValue: string
  onSearchValueChange: (value: string) => void
  onClearFilters?: () => void
}

export const RestockSubscriptionTableFilters = ({
  filters,
  activeFilters,
  onFilterChange,
  searchValue,
  onSearchValueChange,
  onClearFilters,
}: RestockSubscriptionTableFiltersProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  // Derive which filters are currently active (have a value) relative to the provided config
  // Actually, we want to show badges for filters that are "active" in the sense that the user enabled them.
  // But here we rely on value being present.
  // To match typical UI, usually you "add" a filter, it appears empty, then you set value.
  // For simplicity, let's say "active" means present in the activeFilters object (even if undefined/empty? Use undefined to mean 'not active' or 'removed').
  // The parent passes keys with values. If key is missing or undefined, it's not active.

  const activeKeys = Object.keys(activeFilters).filter(
    (k) => activeFilters[k] !== undefined
  )
  const availableFilters = filters.filter((f) => !activeKeys.includes(f.key))

  const handleRemoveFilter = (key: string) => {
    onFilterChange(key, undefined)
  }

  return (
    <div className="flex items-start justify-between gap-x-4 px-6 py-4">
      <div className="flex w-full max-w-[60%] flex-wrap items-center gap-2">
        {activeKeys.map((key) => {
          const config = filters.find((f) => f.key === key)
          if (!config) {
            return null
          }
          const value = activeFilters[key]

          // Resolve label for value
          const valueLabel =
            config.options.find((o) => o.value === value)?.label || value

          return (
            <AsyncSelectFilter
              key={key}
              label={config.label}
              value={value}
              displayValue={valueLabel}
              options={config.options}
              searchable={config.searchable}
              onSearch={config.onSearch}
              hasMore={config.hasMore}
              onLoadMore={config.onLoadMore}
              isLoadingMore={config.isLoadingMore}
              onChange={(val) => onFilterChange(key, val)}
              onRemove={() => handleRemoveFilter(key)}
            />
          )
        })}

        {availableFilters.length > 0 && (
          <RadixPopover.Root modal open={open} onOpenChange={setOpen}>
            <RadixPopover.Trigger asChild>
              <Button size="small" variant="secondary">
                <PlusMini />
                {t("filters.addFilter")}
              </Button>
            </RadixPopover.Trigger>
            <RadixPopover.Portal>
              <RadixPopover.Content
                className="bg-ui-bg-base text-ui-fg-base shadow-elevation-flyout z-50 h-full max-h-[200px] w-[200px] overflow-auto rounded-lg p-1 outline-none"
                align="start"
                sideOffset={8}
                collisionPadding={8}
              >
                {availableFilters.map((filter) => (
                  <div
                    key={filter.key}
                    className="bg-ui-bg-base hover:bg-ui-bg-base-hover focus-visible:bg-ui-bg-base-pressed text-ui-fg-base txt-compact-small relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 outline-none transition-colors"
                    onClick={() => {
                      setOpen(false)
                      // Add filter with empty value or default
                      // We need to signal parent to 'add' it.
                      // Parent handles 'add' by setting value to empty string if currently undefined?
                      // Or we need a way to say "it is active but has no value".
                      // For this implementation, let's assume adding it sets it to "" (empty string).
                      // Then rendering checks for !== undefined.
                      onFilterChange(filter.key, "")
                    }}
                  >
                    {filter.label}
                  </div>
                ))}
              </RadixPopover.Content>
            </RadixPopover.Portal>
          </RadixPopover.Root>
        )}
        {activeKeys.length > 0 && onClearFilters && (
          <Button size="small" variant="transparent" onClick={onClearFilters}>
            Clear
          </Button>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-x-2">
        <div className="bg-ui-bg-field shadow-borders-base transition-fg focus-within:shadow-borders-interactive-with-active flex items-center rounded-md px-2 py-1">
          <MagnifyingGlassMini className="text-ui-fg-muted" />
          <input
            value={searchValue}
            onChange={(e) => onSearchValueChange(e.target.value)}
            className="txt-compact-small placeholder:text-ui-fg-muted ml-2 w-[160px] flex-1 bg-transparent outline-none"
            placeholder="Search"
          />
          {searchValue && (
            <button
              onClick={() => onSearchValueChange("")}
              className="text-ui-fg-muted hover:text-ui-fg-base outline-none"
            >
              <XMarkMini />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

type AsyncSelectFilterProps = {
  label: string
  value?: string
  displayValue?: string
  options: FilterOption[]
  searchable?: boolean
  onSearch?: (query: string) => void
  hasMore?: boolean
  onLoadMore?: () => void
  isLoadingMore?: boolean
  onChange: (value: string) => void
  onRemove: () => void
}

const AsyncSelectFilter = ({
  label,
  value,
  displayValue,
  options,
  searchable,
  onSearch,
  hasMore,
  onLoadMore,
  isLoadingMore,
  onChange,
  onRemove,
}: AsyncSelectFilterProps) => {
  const [open, setOpen] = useState(!value)
  const [search, setSearch] = useState("")
  const [listNode, setListNode] = useState<HTMLDivElement | null>(null)
  const [displayedCount, setDisplayedCount] = useState(BATCH_SIZE)

  // Reset displayed count when options or search changes
  useEffect(() => {
    setDisplayedCount(BATCH_SIZE)
  }, [options, search])

  // Update search when typing
  useEffect(() => {
    if (searchable && onSearch) {
      onSearch(search)
    }
  }, [search, searchable, onSearch])

  const handleSelect = (val: string) => {
    onChange(val)
    setOpen(false)
  }

  useEffect(() => {
    if (!listNode) {
      return
    }

    const handleScroll = () => {
      if (
        listNode.scrollHeight - listNode.scrollTop <=
        listNode.clientHeight + 50
      ) {
        // Local pagination: increment displayed count if there are more options
        if (displayedCount < options.length) {
          setDisplayedCount((prev) =>
            Math.min(prev + BATCH_SIZE, options.length)
          )
        }
        // Server-side pagination (if implemented)
        else if (hasMore && !isLoadingMore && onLoadMore) {
          onLoadMore()
        }
      }
    }

    listNode.addEventListener("scroll", handleScroll)
    return () => {
      listNode.removeEventListener("scroll", handleScroll)
    }
  }, [
    listNode,
    hasMore,
    isLoadingMore,
    onLoadMore,
    displayedCount,
    options.length,
  ])

  return (
    <RadixPopover.Root open={open} onOpenChange={setOpen} modal>
      <FilterChip label={label} value={displayValue} onRemove={onRemove} />
      <RadixPopover.Portal>
        <RadixPopover.Content
          className="bg-ui-bg-base text-ui-fg-base shadow-elevation-flyout z-50 w-[300px] overflow-hidden rounded-lg outline-none"
          align="start"
          sideOffset={8}
          collisionPadding={8}
          hideWhenDetached
        >
          <Command className="flex flex-col" shouldFilter={!onSearch}>
            {searchable && (
              <div className="border-b p-1">
                <div className="grid grid-cols-[1fr_20px] gap-x-2 rounded-md px-2 py-1">
                  <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    className="txt-compact-small placeholder:text-ui-fg-muted flex-1 bg-transparent outline-none"
                    placeholder="Search..."
                    autoFocus
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="text-ui-fg-muted hover:text-ui-fg-base flex items-center justify-center outline-none"
                    >
                      <XMarkMini />
                    </button>
                  )}
                </div>
              </div>
            )}
            <Command.List
              ref={setListNode}
              className="max-h-[200px] overflow-y-auto p-1 outline-none"
            >
              <Command.Empty className="txt-compact-small text-ui-fg-muted p-2 text-center">
                No results found.
              </Command.Empty>
              {options.slice(0, displayedCount).map((option) => (
                <Command.Item
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option.value)}
                  className="bg-ui-bg-base hover:bg-ui-bg-base-hover aria-selected:bg-ui-bg-base-pressed text-ui-fg-base txt-compact-small flex cursor-pointer select-none items-center gap-x-2 rounded-md px-2 py-1.5 outline-none transition-colors"
                >
                  <div
                    className={clx(
                      "transition-fg flex h-5 w-5 items-center justify-center",
                      {
                        invisible: value !== option.value,
                      }
                    )}
                  >
                    <CheckMini />
                  </div>
                  <span className="truncate">{option.label}</span>
                </Command.Item>
              ))}
              {(displayedCount < options.length || isLoadingMore) && (
                <div className="txt-compact-small text-ui-fg-muted p-2 text-center">
                  Loading...
                </div>
              )}
            </Command.List>
          </Command>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
