import { toast, Toaster } from "@medusajs/ui"
import { RouteFocusModal } from "../../../components/modals"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { FieldValues, useForm } from "react-hook-form"
import { sdk } from "../../../lib/client"
import { useEffect, useState } from "react"
import DynamicForm, {
  SchemaField,
} from "../../../components/custom/components/form/DynamicForm"
import { blogSchema } from "../blogSchema"

export const BlogEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [schema, setSchema] = useState<Record<string, SchemaField>>({})
  const form = useForm<FieldValues>({
    defaultValues: {
      title: state.title,
      subtitle: state.subtitle,
      handle: state.handle,
      content: state.content,
      categories:
        state?.product_categories?.map((x: { id: string }) => x.id) || [],
    },
  })

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const schemaData = await blogSchema()
        setSchema(schemaData)
      } catch (error) {
        console.error("Error loading schema:", error)
        toast.error("Failed to load schema")
      }
    }
    loadSchema()
  }, [])

  const onSubmit = async (data: FieldValues) => {
    try {
      const response = await sdk.admin.blog.update(id!, data)

      if (response) {
        navigate("/blogs")
        navigate(0)
      }
    } catch (error: any) {
      toast.error("Failed to Update Blog", {
        description: error.message,
        duration: 5000,
      })
      console.error("Error updating blog:", error.message)
    }
  }

  return (
    <RouteFocusModal>
      <Toaster />
      <RouteFocusModal.Header />
      <RouteFocusModal.Body className="overflow-auto">
        <div className="w-full p-5">
          <DynamicForm
            form={form}
            onSubmit={onSubmit}
            schema={schema}
            isPending={form.formState.isSubmitting}
          />
        </div>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
