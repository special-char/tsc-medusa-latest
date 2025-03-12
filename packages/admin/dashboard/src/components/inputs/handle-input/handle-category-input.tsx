import { useCategoryTableQuery } from "../../../routes/categories/category-list/components/category-list-table/use-category-table-query"
import { useProductCategories } from "../../../hooks/api"
import { keepPreviousData } from "@tanstack/react-query"
import { NestedCategorySelector } from "./nested-category-selector/nested-category-selector"


export const HandleCategoryInput = (props: {
  value: string
  onChange: (value?: string | null) => void
  placeholder: string
}) => {
  const { raw, searchParams } = useCategoryTableQuery({})

  const query = raw.q
    ? {
      include_ancestors_tree: true,
      fields: "id,name,handle,is_active,is_internal,parent_category",
      ...searchParams,
    }
    : {
      include_descendants_tree: true,
      parent_category_id: "null",
      fields: "id,name,category_children,handle,is_internal,is_active",
      ...searchParams,
    }

  const { product_categories } = useProductCategories(
    {
      ...query,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  return (
    <NestedCategorySelector
      product_categories={product_categories}
      value={props.value}
      onChange={props.onChange}
    />
  )
}
HandleCategoryInput.displayName = "HandleCategoryInput"
