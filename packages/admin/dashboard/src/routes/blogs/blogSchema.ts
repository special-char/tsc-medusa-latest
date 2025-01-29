import { AdminProductCategory } from "@medusajs/types"
import { sdk } from "../../lib/client"
import { UseFormReturn } from "react-hook-form"

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
    image: {
      label: "Blog Image",
      fieldType: "seo-file-upload",
      props: {
        multiple: false,
      },
      validation: {},
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

export const blogSEOSchema = ({
  form,
  blogSeo,
}: {
  form: UseFormReturn
  blogSeo: Record<string, any>
}) => {
  const schema = {
    metaTitle: {
      label: "Meta Title",
      fieldType: "input",
      validation: {
        required: {
          value: true,
          message: "Meta Title is required field",
        },
        maxLength: { value: 60, message: "max. 60 characters" },
        pattern: {
          value: /^(?!^\d+$)^.+$/,
          message: "Meta Title should not contain only numbers",
        },
      },
    },
    metaDescription: {
      label: "Meta Description",
      fieldType: "textarea",
      validation: {
        required: {
          value: true,
          message: "Meta Description is required field",
        },
        minLength: { value: 50, message: "min. 50 characters" },
        maxLength: { value: 160, message: "max. 160 characters" },
        pattern: {
          value: /^(?!^\d+$)^.+$/,
          message: "Meta Description should not contain only numbers",
        },
      },
    },
    metaImage: {
      label: "Meta Image",
      fieldType: "seo-file-upload",
      props: {
        multiple: false,
      },
      validation: {},
    },
    metaSocial: {
      label: "Meta Social",
      fieldType: "socialfieldArray",
      props: {
        name: "metaSocial",
        form,
        productSeo: blogSeo,
        // fields: {
        //   socialNetwork: {
        //     label: "Social Network",
        //     fieldType: "select",
        //   },
        //   title: {
        //     label: "Title",
        //     fieldType: "input",
        //     validation: {
        //       pattern: {
        //         value: /^(?!^\d+$)^.+$/,
        //         message: "Title should not contain only numbers",
        //       },
        //     },
        //   },
        //   description: {
        //     label: "Description",
        //     fieldType: "textarea",
        //     validation: {
        //       pattern: {
        //         value: /^(?!^\d+$)^.+$/,
        //         message: "Description should not contain only numbers",
        //       },
        //     },
        //   },
        //   image: {
        //     label: "Image",
        //     fieldType: "image-upload",
        //     props: {
        //       placeholder: "Upload a image (up to 10MB)",
        //       multiple: false,
        //     },
        //   },
        // },
      },
    },
    keywords: {
      label: "Keywords",
      fieldType: "textarea",
      validation: {
        maxLength: { value: 255, message: "max. 255 characters" },
        pattern: {
          value: /^(?!^\d+$)^.+$/,
          message: "Keywords should not contain only numbers",
        },
      },
    },
    metaRobots: {
      label: "Meta Robots",
      fieldType: "input",
      validation: {
        pattern: {
          value: /^(?!^\d+$)^.+$/,
          message: "Robots should not contain only numbers",
        },
      },
    },
    structuredData: {
      label: "Structured Data",
      fieldType: "textarea",
      validation: {
        maxLength: { value: 10000, message: "max. 10000 characters" },
        validate: {
          isValidJson: (value: string) => {
            if (typeof value !== "string") {
              return "Structured Data must be a valid JSON string"
            }
            try {
              const parsed = JSON.parse(value)
              if (typeof parsed !== "object" || parsed === null) {
                return "Structured Data must be a valid JSON object or array"
              }
              return true
            } catch {
              return "Invalid JSON format"
            }
          },
        },
      },
    },
    metaViewport: {
      label: "Meta Viewport",
      fieldType: "input",
      validation: {
        // pattern: {
        //   value:
        //     /^(width|height|initial-scale|maximum-scale|minimum-scale|user-scalable)$/,
        //   message: "Invalid Meta Viewport format",
        // },
        pattern: {
          value: /^(?!^\d+$)^.+$/,
          message: "Viewport should not contain only numbers",
        },
      },
    },
    canonicalURL: {
      label: "Canonical URL",
      fieldType: "input",
      validation: {
        pattern: {
          value:
            /^(https?:\/\/)(www\.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)$/,
          message: "Invalid URL format",
        },
      },
    },
  }

  return schema
}
