import { ChevronDown, ChevronRight, XMark } from "@medusajs/icons"
import { AdminProductCategory } from "@medusajs/types"
import { Button, clx, Input, Text } from "@medusajs/ui"
import {
  ChangeEventHandler,
  ForwardedRef,
  RefAttributes,
  useEffect,
  useState,
} from "react"

const flattenCategoryTree = (categories: AdminProductCategory[]) => {
  const result: Record<string, any> = {}

  const processCategory = (
    category: AdminProductCategory,
    parentHandle?: string,
    ancestryHandles: string[] = [],
    ancestryNames: string[] = []
  ) => {
    const currentAncestryHandles = [...ancestryHandles, category.handle]
    const currentAncestryNames = [...ancestryNames, category.name]

    result[category.handle] = {
      category,
      parentHandle,
      ancestryHandles: currentAncestryHandles,
      ancestryNames: currentAncestryNames,
    }

    if (category.category_children) {
      category.category_children.forEach((child) =>
        processCategory(
          child,
          category.handle,
          currentAncestryHandles,
          currentAncestryNames
        )
      )
    }
  }

  categories?.forEach((category) => processCategory(category))
  return result
}

export const NestedCategorySelector = ({
  product_categories,
  value,
  onChange,
}: {
  product_categories: AdminProductCategory[] | undefined
  value: string
  onChange: (value: string) => void
}) => {
  // console.log("product_categories:::::::::::::::", product_categories)
  // const [inputValue, setInputValue] = useState("")
  // const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({})
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const flattenedCategories = flattenCategoryTree(
    product_categories as AdminProductCategory[]
  )

  const toggleCategorySelection = (handle: string) => {
    const category = flattenedCategories[handle]
    const ancestry = category?.ancestryHandles

    const selectedCategories = value ? value.split("/") : []

    if (selectedCategories.includes(handle)) {
      // Remove all children of the selected category when deselecting
      const categoriesToRemove = Object.values(flattenedCategories)
        .filter((item) => item.ancestryHandles.includes(handle))
        .map((item) => item.category.handle)

      const newSelectedCategories = selectedCategories.filter(
        (cat) => !categoriesToRemove.includes(cat)
      )
      onChange(newSelectedCategories.join("/"))
    } else {
      const newRoot = ancestry?.[0] // Find the new root parent category
      const currentRoots = selectedCategories.map(
        (cat) => flattenedCategories[cat]?.ancestryHandles[0]
      )

      // If a new root category is selected, clear all previous selections
      if (!currentRoots.includes(newRoot)) {
        onChange(handle) // Only select the new root
      } else {
        // Otherwise, allow selecting child categories within the same root
        const newSelectedCategories = selectedCategories.filter((cat) => {
          const catAncestry = flattenedCategories[cat]?.ancestryHandles
          return !(
            catAncestry &&
            catAncestry.length === ancestry?.length &&
            catAncestry.slice(0, -1).join("/") ===
            ancestry?.slice(0, -1).join("/")
          )
        })

        newSelectedCategories.push(handle)
        onChange(newSelectedCategories.join("/"))
      }
    }
  }

  const toggleExpand = (handle: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedCategories((prev) => ({
      ...prev,
      [handle]: !prev[handle],
    }))
  }

  const clearSelection = () => {
    onChange("")
  }

  const renderCategoryItem = (category: AdminProductCategory, depth = 0) => {
    const hasChildren =
      category.category_children && category.category_children.length > 0
    const isExpanded = !!expandedCategories[category.handle]
    const selectedCategories = value ? value.split("/") : []
    const isSelected = selectedCategories.includes(category.handle)

    return (
      <div key={category.handle}>
        <div className="absolute right-1 top-1">
          {selectedCategories.length > 0 && (
            <Button
              type="button"
              onClick={clearSelection}
              className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover flex items-center gap-1 rounded-full px-1"
            >
              <XMark className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div
          className={clx(
            "flex cursor-pointer items-center",
            { "ml-0": depth === 0 },
            { "ml-4": depth === 1 },
            { "ml-8": depth === 2 },
            { "ml-12": depth >= 3 }
          )}
          onClick={() => toggleCategorySelection(category.handle)}
        >
          <button
            type="button"
            onClick={(e) => toggleExpand(category.handle, e)}
            className={clx("mr-2 flex h-5 w-5 items-center justify-center", {
              invisible: !hasChildren,
            })}
            tabIndex={-1}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          <div className="relative flex h-5 w-5 items-center justify-center">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white">
              {isSelected && (
                <div className="border-ui-button-inverted h-4 w-4 rounded-full border-2 bg-white shadow-md"></div>
              )}
            </div>
          </div>

          <span className="ml-2 text-sm font-medium leading-none">
            {category.name}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2 flex flex-col gap-2">
            {category.category_children?.map((child) =>
              renderCategoryItem(child, depth + 1)
            )}
          </div>
        )}
      </div>
    )
  }

  // const categoryPath =
  //   selectedCategories.length > 0
  //     ? selectedCategories
  //         .sort((a, b) => {
  //           const ancestryA =
  //             flattenedCategories[a]?.ancestryHandles.length || 0
  //           const ancestryB =
  //             flattenedCategories[b]?.ancestryHandles.length || 0
  //           return ancestryA - ancestryB
  //         })
  //         .map((cat) => flattenedCategories[cat]?.category?.handle)
  //         .join("/")
  //     : ""

  // useEffect(() => {
  //   const value =
  //     selectedCategories.length > 0
  //       ? selectedCategories
  //         .sort((a, b) => {
  //           const ancestryA =
  //             flattenedCategories[a]?.ancestryHandles.length || 0
  //           const ancestryB =
  //             flattenedCategories[b]?.ancestryHandles.length || 0
  //           return ancestryA - ancestryB
  //         })
  //         .map((cat) => flattenedCategories[cat]?.category?.handle)
  //         .join("/")
  //       : ""
  //   onChange(value)
  // }, [selectedCategories])
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputValue(e.target.value)
  // }

  // const finalHandle = categoryPath ? `${categoryPath} / ${value}` : value
  // console.log("finalHandle:::::", finalHandle)

  return (
    <div className="relative w-full">
      <div
        className={clx(
          "shadow-buttons-neutral text-ui-fg-base bg-ui-button-neutral after:button-neutral-gradient flex w-full items-center gap-1 overflow-hidden rounded-md",
          "hover:bg-ui-button-neutral-hover hover:after:button-neutral-hover-gradient",
          "active:bg-ui-button-neutral-pressed active:after:button-neutral-pressed-gradient",
          "focus-visible:shadow-buttons-neutral-focus"
        )}
      >
        <Button
          type="button"
          variant="secondary"
          className="rounded-none bg-transparent"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Text
            className="text-ui-fg-muted"
            size="small"
            leading="compact"
            weight="plus"
          >
            /
          </Text>
        </Button>
        {value && (
          <Text
            // className="text-ui-fg-muted"
            size="base"
            leading="compact"
            weight="plus"
          >
            {value}
          </Text>
        )}
      </div>
      {isDropdownOpen && (
        <div className="bg-ui-bg-field-component absolute z-10 mt-2 w-full max-w-[400px] rounded-lg border p-4 shadow-md">
          <div className="flex flex-col gap-2">
            {product_categories?.map((category) =>
              renderCategoryItem(category)
            )}
          </div>
        </div>
      )}
    </div>
  )
}
NestedCategorySelector.displayName = "NestedCategorySelector"
