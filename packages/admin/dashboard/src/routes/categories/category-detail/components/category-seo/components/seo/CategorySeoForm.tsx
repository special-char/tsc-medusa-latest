import { AdminProductCategory } from "@medusajs/types"
import DynamicForm from "../../../../../../../components/custom/components/form/DynamicForm"
import { FieldValues, useForm } from "react-hook-form"
import { SeoDetailsTypes } from "../../../../../../products/product-detail/components/product-seo"
import { sdk } from "../../../../../../../lib/client"
import { useNavigate } from "react-router-dom"

type Props = {
  category: AdminProductCategory
  categorySeo?: SeoDetailsTypes
}

const CategorySeoForm = ({ categorySeo, category }: Props) => {
  const navigate = useNavigate()
  const form = useForm<FieldValues>({
    defaultValues: {
      metaTitle: categorySeo?.metaTitle ?? "",
      metaDescription: categorySeo?.metaDescription ?? "",
      metaImage: categorySeo?.metaImage ?? "",
      metaSocial:
        Array.isArray(categorySeo?.metaSocial) &&
        categorySeo?.metaSocial?.length > 0
          ? [
              ...categorySeo.metaSocial.map((item: any) => ({
                ...item,
                socialNetwork: item.socialNetwork || "Facebook",
                title: item.title || "",
                description: item.description || "",
                image: item.image || "",
              })),
            ]
          : undefined,
      keywords: categorySeo?.keywords ?? "",
      metaRobots: categorySeo?.metaRobots ?? "",
      structuredData: JSON.stringify(
        categorySeo?.structuredData?.structuredData || {}
      ),
      metaViewport: categorySeo?.metaViewport ?? "",
      canonicalURL: categorySeo?.canonicalURL ?? "",
    },
  })

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
      validation: {},
      props: {
        name: "metaSocial",
        form,
        productSeo: categorySeo,
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

  const onSubmit = async (data: any) => {
    try {
      if (!categorySeo) {
        await sdk.admin.categorySeo.create(category.id, data)
        navigate(`/categories/${category.id}`, {
          replace: true,
          state: { isSubmitSuccessful: true },
        })
      } else {
        await sdk.admin.categorySeo.update(
          category?.id,
          categorySeo?.id as string,
          data
        )
        navigate(`/categories/${category.id}`, {
          replace: true,
          state: { isSubmitSuccessful: true },
        })
      }
      navigate(0)
    } catch (error: unknown) {
      console.error("Error", error)
    }
  }
  return (
    <div className="mx-auto w-full max-w-4xl px-10">
      <h3 className="mb-6 text-2xl font-semibold">SEO for - {category.name}</h3>
      <DynamicForm
        form={form}
        isPending={form.formState.isSubmitting}
        onSubmit={onSubmit}
        schema={schema}
        onReset={() => {
          const metaSocial = form.getValues("metaSocial")
          form.reset({
            metaTitle: " ",
            metaDescription: " ",
            metaImage: null,
            metaSocial: metaSocial.map((item: any) => ({
              ...item,
              isDeleted: true,
            })),
            keywords: " ",
            metaRobots: " ",
            structuredData: JSON.stringify({}),
            metaViewport: " ",
            canonicalURL: " ",
          })
        }}
      />
    </div>
  )
}

export default CategorySeoForm
