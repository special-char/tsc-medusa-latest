import { useForm, FieldValues, UseFormReturn } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import DynamicForm from "../form/DynamicForm"
import { SeoDetailsTypes } from "../.."
import { sdk } from "../../../../../../../lib/client"
import { useRouteModal } from "../../../../../../../components/modals"

type Props = {
  product: any
  productSeo: SeoDetailsTypes
}
type SchemaField = {
  label: string
  fieldType: string
  props?: any
  validation?: Record<string, any>
}

const formFields = (
  form: UseFormReturn<FieldValues>,
  productSeo: SeoDetailsTypes
): Record<string, SchemaField> => ({
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
    fieldType: "file-upload",
    props: {
      multiple: false,
    },
  },
  metaSocial: {
    label: "Meta Social",
    fieldType: "fieldArray",

    props: {
      name: "metaSocial",
      form,
      productSeo,
      fields: {
        socialNetwork: {
          label: "Social Network",
          fieldType: "select",
        },
        title: {
          label: "Title",
          fieldType: "input",
          validation: {
            pattern: {
              value: /^(?!^\d+$)^.+$/,
              message: "Title should not contain only numbers",
            },
          },
        },
        description: {
          label: "Description",
          fieldType: "textarea",
          validation: {
            pattern: {
              value: /^(?!^\d+$)^.+$/,
              message: "Description should not contain only numbers",
            },
          },
        },
        image: {
          label: "Image",
          fieldType: "file-upload",
        },
      },
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
  feedData: {
    label: "Feed Data",
    fieldType: "textarea",
    validation: {
      maxLength: { value: 10000, message: "max. 10000 characters" },
      validate: {
        isValidJson: (value: string) => {
          if (typeof value !== "string") {
            return "Feed Data must be a valid JSON string"
          }
          try {
            const parsed = JSON.parse(value)
            if (typeof parsed !== "object" || parsed === null) {
              return "Feed Data must be a valid JSON object or array"
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
})
const SeoForm = ({ product, productSeo }: Props) => {
  const navigate = useNavigate()

  const form = useForm<FieldValues>({
    defaultValues: {
      metaTitle: productSeo?.metaTitle || "",
      metaDescription: productSeo?.metaDescription || "",
      metaImage: productSeo?.metaImage || "",
      metaSocial:
        Array.isArray(productSeo?.metaSocial) &&
        productSeo?.metaSocial.length > 0
          ? [
              ...productSeo?.metaSocial.map((item: any) => ({
                ...item,
                socialNetwork: item?.socialNetwork || "Facebook",
                title: item?.title || "",
                description: item?.description || "",
                image: item?.image || "",
              })),
            ]
          : undefined,
      keywords: productSeo?.keywords,
      metaRobots: productSeo?.metaRobots,
      structuredData: productSeo?.structuredData || "{}",
      feedData: productSeo?.feedData || "{}",
      metaViewport: productSeo?.metaViewport,
      canonicalURL: productSeo?.canonicalURL,
    },
  })
  const onSubmit = async (data: FieldValues) => {
    // return;
    try {
      if (!productSeo) {
        console.log("data::::::::::;", data)

        await sdk.admin.productSeo.create(product.id, data)
        navigate(`/products/${product.id}`, {
          replace: true,
          state: { isSubmitSuccessful: true },
        })
        // handleSuccess()
      } else {
        await sdk.admin.productSeo.update(
          product?.id,
          productSeo?.id as string,
          data
        )
        navigate(`/products/${product.id}`, {
          replace: true,
          state: { isSubmitSuccessful: true },
        })
      }
      navigate(0)
    } catch (error: unknown) {
      console.error("Error", error)
    }
  }
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault()
    }
  }
  return (
    <div className="mx-auto w-full max-w-4xl px-10">
      {/* <div className="bg-white p-8 border border-gray-200 rounded-lg"> */}
      <h3 className="mb-6 text-2xl font-semibold">SEO for - {product.title}</h3>
      <DynamicForm
        form={form}
        onSubmit={onSubmit}
        onReset={() => {
          const metaSocial = form.getValues("metaSocial")
          form.reset(
            {
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
              feedData: JSON.stringify({}),
              metaViewport: " ",
              canonicalURL: " ",
            },
            {}
          )
        }}
        onKeyDown={handleKeyDown}
        schema={formFields(form, productSeo)}
      />
    </div>
  )
}

export default SeoForm
