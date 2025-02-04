import { AdminProduct } from "@medusajs/types"
import DynamicForm from "../../../components/custom/components/form/DynamicForm"
import { FieldValues, useForm } from "react-hook-form"
import { toast } from "@medusajs/ui"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../../lib/client"
import { useEffect, useState, useCallback, useMemo } from "react"

type Props = {
  product: AdminProduct
}

const ProductGoogleCategoryForm = ({ product }: Props) => {
  const [googleCategories, setGoogleCategories] = useState<
    { id: number; path: string }[]
  >([])

  const navigate = useNavigate()

  const fetchGoogleCategories = useCallback(async () => {
    try {
      const response = await sdk.admin.googleCategory.list()
      setGoogleCategories(response.googleCategories)
    } catch (error) {
      console.error("Failed to fetch Google Categories", error)
    }
  }, [])

  useEffect(() => {
    fetchGoogleCategories()
  }, [fetchGoogleCategories])

  const optionsForCategory = useMemo(
    () => googleCategories.map(({ path }) => ({ value: path, label: path })),
    [googleCategories]
  )

  const form = useForm<FieldValues>({
    defaultValues: {
      googleCategory: product?.metadata?.googleCategory || "",
    },
  })

  const onSubmit = async (data: FieldValues) => {
    try {
      await sdk.admin.product.update(product.id, {
        metadata: { ...product.metadata, googleCategory: data.googleCategory },
      })
      toast(`Google Category for product ${product.title} Updated`)
      navigate(0)
    } catch (error) {
      console.error("Error updating Google Category", error)
      toast(`Error updating Google Category for product ${product.title}`)
    }
  }

  const formSchema = useMemo(
    () => ({
      googleCategory: {
        label: "Google Category",
        fieldType: "searchable-select",
        props: {
          options: optionsForCategory,
          placeholder: "Select a Google Category...",
          displayCount: 100,
        },
        validation: {
          required: {
            value: true,
            message: "Google Category is required",
          },
        },
      },
    }),
    [optionsForCategory]
  )

  return (
    <DynamicForm
      form={form}
      onSubmit={onSubmit}
      schema={formSchema}
      isPending={form.formState.isSubmitting}
    />
  )
}

export default ProductGoogleCategoryForm
