import { useForm, FieldValues } from "react-hook-form"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AdminProduct } from "@medusajs/framework/types"
import DynamicForm from "../../../components/custom/components/form/DynamicForm"
import { sdk } from "../../../lib/client"
import { toast } from "@medusajs/ui"

// type Notify = {
// 	success: (title: string, message: string) => void;
// 	error: (title: string, message: string) => void;
// 	warn: (title: string, message: string) => void;
// 	info: (title: string, message: string) => void;
// };

type ExtendedProduct = AdminProduct & {
  additional_details?: {
    id: string
    additional_description: string
    additional_details_title: string
    additional_details_content: string
    grid_view: boolean
  }
}

type Props = {
  product: ExtendedProduct
  // notify: Notify;
}

const formSchema = {
  additional_description: {
    label: "Additional Description",
    fieldType: "markdown-editor",
    props: { placeholder: "Additional Description for product" },
    validation: {},
  },
  additional_details_title: {
    label: "Detail Modal Title",
    fieldType: "textarea",
    validation: {},
  },
  additional_details_content: {
    label: "Detail Modal Content",
    fieldType: "markdown-editor",
    validation: {},
  },
  grid_view: {
    label: "Product Image Grid View",
    fieldType: "toggle",
    validation: {},
  },
}

const getProductAdditionalDetails = async (id: string) => {
  const data = await sdk.admin.product.retrieve(id, {
    fields: "+additional_details.*",
  })

  return data
}

const ProductAdditionalDetailsForm = ({ product }: Props) => {
  const [data, setData] = useState<ExtendedProduct | null>(null)
  // const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const form = useForm<FieldValues>({
    defaultValues: {
      additional_description:
        data?.additional_details?.additional_description || "",
      additional_details_title:
        data?.additional_details?.additional_details_title || "",
      additional_details_content:
        data?.additional_details?.additional_details_content || "",
      grid_view: data?.additional_details?.grid_view || false,
    },
  })

  const onSubmit = async (data: FieldValues) => {
    console.log({ data })

    // setLoading(true)

    try {
      // const response = await fetch(
      //   `${backendUrl}/admin/product-additional-details/product/${product?.id}`,
      //   {
      //     method: "POST",
      //     credentials: "include",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(data),
      //   }
      // )

      const response =
        await sdk.admin.productAdditionalDetails.updateProductAdditionalDetails(
          product.id,
          {
            additional_description: data?.additional_description,
            additional_details_content: data?.additional_details_content,
            additional_details_title: data?.additional_details_title,
            grid_view: data?.grid_view,
          }
        )
      // const json = await response.json()

      // notify.success("Done", "success");

      toast(`Additional Details for product ${product.title} Updated`)
      // navigate(0)
    } catch (error) {
      // notify.error("Error", error);
      console.error("error occured while submitting data", { error })
      toast(
        `Error occured while updating Additional Details for product ${product.title}`
      )
    } finally {
      // setLoading(false)
    }
  }

  useEffect(() => {
    console.log(data)

    form.reset({
      additional_description:
        data?.additional_details?.additional_description || "",
      additional_details_title:
        data?.additional_details?.additional_details_title || "",
      additional_details_content:
        data?.additional_details?.additional_details_content || "",
      grid_view: data?.additional_details?.grid_view || false,
    })
  }, [data])

  useEffect(() => {
    // setLoading(true)

    getProductAdditionalDetails(product?.id)
      .then(({ product }) => {
        setData(product)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        // setLoading(false)
      })
  }, [])

  return (
    <>
      <DynamicForm form={form} onSubmit={onSubmit} schema={formSchema} />
    </>
  )
}

export default ProductAdditionalDetailsForm
