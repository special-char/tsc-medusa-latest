import { FieldValues, useForm } from "react-hook-form"
import { AdminProductCategory } from "@medusajs/framework/types"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { aspectRatioOptions } from "../constants"
import DynamicForm from "../../../components/custom/components/form/DynamicForm"
import { sdk } from "../../../lib/client"
import { toast } from "@medusajs/ui"

const formSchema = {
  thumbnail: {
    label: "Category Thumbnail",
    fieldType: "image-upload",
    props: {
      placeholder: "Upload a thumbnail image (up to 10MB)",
      multiple: false, // Ensure only one file is allowed
      filetypes: ["image/jpeg", "image/png", "image/webp"], // Supported types
    },
    validation: {},
  },
  media: {
    label: "Category Media",
    fieldType: "image-upload",
    props: {
      placeholder: "Upload a media image (up to 10MB)",
      multiple: true, // Ensure only one file is allowed
      filetypes: ["image/jpeg", "image/png", "image/webp"], // Supported types
    },
    validation: {},
  },
  product_aspect_ratio: {
    label: "Product aspect-ratio",
    fieldType: "select",
    props: {
      placeholder: "Select aspect ratio",
      options: aspectRatioOptions,
    },
    validation: {},
  },
  product_bg_color: {
    label: "Product Background Color",
    fieldType: "color-picker",
    validation: {},
  },
}

type ExtendedProductCategory = AdminProductCategory & {
  category_details?: {
    id: string
    thumbnail?: string | null
    media?: string[] | null
    product_aspect_ratio: string
    product_bg_color: string
  }
}

const getProductCategoryDetails = async (id: string) => {
  // eslint-disable-next-line prettier/prettier
  const data =
    await sdk.admin.productCategoryDetails.retrieveByProductCategory(id)

  return data
}

const ProductCategoryDetailsForm = ({
  category,
}: {
  category: AdminProductCategory
}) => {
  const [data, setData] = useState<ExtendedProductCategory | null>(null)
  const navigate = useNavigate()

  const form = useForm<FieldValues>({
    defaultValues: {
      thumbnail: data?.category_details?.thumbnail
        ? {
            id: data?.category_details?.thumbnail,
            url: data?.category_details?.thumbnail,
          }
        : null,
      media:
        data?.category_details?.media?.map((item) => ({
          id: item,
          url: item,
        })) ?? null,
      product_aspect_ratio: data?.category_details?.product_aspect_ratio || "",
      product_bg_color: data?.category_details?.product_bg_color || "",
    },
  })

  const resetFormData = () => {
    form.reset({
      product_aspect_ratio: data?.category_details?.product_aspect_ratio,
      product_bg_color: data?.category_details?.product_bg_color || "",
      thumbnail: data?.category_details?.thumbnail
        ? {
            id: data?.category_details?.thumbnail,
            url: data?.category_details?.thumbnail,
          }
        : null,
      media:
        data?.category_details?.media?.map((item, index) => ({
          id: `${item}-${index}`,
          url: item,
        })) ?? null,
    })
  }

  const onSubmit = async (formFields: FieldValues) => {
    console.log(formFields)

    try {
      if (data?.id) {
        const response =
          await sdk.admin.productCategoryDetails.updateProductCategoryDetails(
            data.id,
            {
              ...formFields,
            }
          )
        toast("Product Category details updated")
        navigate(0)
        return
      }

      toast("Category id not found")
    } catch (error) {
      // notify.error("Error", error);
      console.error("error occured while submitting data", { error })
    }
  }

  useEffect(() => {
    console.log(data)

    resetFormData()
  }, [data, form])

  useEffect(() => {
    getProductCategoryDetails(category?.id)
      .then(({ category }) => {
        setData(category)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <>
      <DynamicForm
        form={form}
        onSubmit={onSubmit}
        onReset={resetFormData}
        schema={formSchema}
      />
    </>
  )
}

export default ProductCategoryDetailsForm
