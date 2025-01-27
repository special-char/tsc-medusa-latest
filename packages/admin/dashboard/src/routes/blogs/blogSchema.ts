import { AdminProductCategory } from "@medusajs/types"
import { sdk } from "../../lib/client"
export const transformCategories = (categories: AdminProductCategory[]) => {
  return categories.map((category) => {
    const transformed: { label: string; value: string; children?: any } = {
      label: category.name,
      value: category.id,
    }

    if (category.category_children && category.category_children.length > 0) {
      transformed.children = transformCategories(category.category_children)
    }

    return transformed
  })
}
export const blogSchema = async () => {
  const { product_categories } = await sdk.admin.productCategory.list({
    include_descendants_tree: true,
    parent_category_id: "null",
  })

  const categoriesSchema = transformCategories(product_categories)

  const schema = {
    title: {
      label: "Blog Title",
      fieldType: "input",
      validation: {
        required: {
          value: true,
          message: "Title is required",
        },
        pattern: {
          value: /^(?!^\d+$)^.+$/,
          message: "Title should not contain only numbers",
        },
      },
    },
    subtitle: {
      label: "Blog Subtitle",
      fieldType: "input",
      validation: {
        pattern: {
          value: /^(?!^\d+$)^.+$/,
          message: "Subtitle should not contain only numbers",
        },
      },
    },
    handle: {
      label: "Blog Handle",
      fieldType: "input",
      validation: {
        required: {
          value: true,
          message: "Handle is required",
        },
        pattern: {
          value: /^(?!^\d+$)^.+$/,
          message: "Handle should not contain only numbers",
        },
      },
    },
    categories: {
      label: "Categories",
      fieldType: "nested-select",
      props: {
        options: categoriesSchema,
        placeholder: "Select categories...",
      },
      validation: {},
    },
    content: {
      label: "Blog Content",
      fieldType: "markdown-editor",
      validation: {
        required: {
          value: true,
          message: "Content is required",
        },
      },
    },
  }

  return schema
}
