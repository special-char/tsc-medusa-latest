import { FieldValues, useForm } from "react-hook-form"
import { AdminProductCategory } from "@medusajs/framework/types"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { aspectRatioOptions } from "../constants"
import DynamicForm from "../../../components/custom/components/form/DynamicForm"
import { backendUrl } from "../../../lib/client"

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
  const response = await fetch(
    `${backendUrl}/admin/product-category-details/category/${id}`,
    {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  )

  if (!response.ok) {
    // notify.error("failed", "Something went wrong...");
    throw new Error("something went wrong...")
  }

  const json = await response.json()
  return json
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

    const oldMedia =
      formFields?.media?.reduce((acc: string[], x: any) => {
        if (!x.file && x.url) {
          acc.push(x.url)
        }
        return acc
      }, []) ?? null

    const newMedia =
      formFields?.media?.reduce((acc: File[], x: any) => {
        if (x.file) {
          acc.push(x.file)
        }
        return acc
      }, []) ?? null

    try {
      const formData = new FormData()
      if (
        formFields?.product_aspect_ratio &&
        formFields?.product_aspect_ratio !== ""
      )
        formData.append(
          "product_aspect_ratio",
          formFields?.product_aspect_ratio
        )

      if (formFields?.product_bg_color && formFields?.product_bg_color !== "")
        formData.append("product_bg_color", formFields?.product_bg_color)

      if (formFields?.thumbnail?.file) {
        formData.append(
          "thumbnail",
          formFields?.thumbnail?.file,
          formFields?.thumbnail?.file.name
        )
      }

      if (formFields?.thumbnail?.url) {
        formData.append("old_thumbnail", formFields?.thumbnail?.url)
      }

      if (oldMedia && oldMedia?.length > 0) {
        oldMedia?.forEach((item: string) => {
          formData.append("old_media[]", item)
        })
      }

      if (newMedia && newMedia?.length > 0) {
        newMedia?.forEach((media: File) => {
          formData.append("media", media, media.name)
        })
      }

      const response = await fetch(
        `${backendUrl}/admin/product-category-details/category/${data?.id}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      )

      if (!response.ok) {
        // notify.error("failed", "Something went wrong...");
        return
      }

      const json = await response.json()

      // notify.success("Done", "success");
      console.log("Done success")
      navigate(0)
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
