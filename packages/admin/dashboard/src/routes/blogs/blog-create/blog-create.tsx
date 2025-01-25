import { toast, Toaster } from "@medusajs/ui"
import { RouteFocusModal } from "../../../components/modals"
import { FieldValues, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import DynamicForm, {
  SchemaField,
} from "../../../components/custom/components/form/DynamicForm"
import { sdk } from "../../../lib/client"
import { useEffect, useState } from "react"
import { blogSchema } from "../blogSchema"

export const BlogCreate = () => {
  const navigate = useNavigate()
  const [schema, setSchema] = useState<Record<string, SchemaField>>({})
  const onSubmit = async (data: FieldValues) => {
    try {
      const createBlogData = {
        title: data.title,
        subtitle: data.subtitle,
        handle: data.handle,
        content: data.content,
        categories: data.categories,
      }
      const createBlogResponse = await sdk.admin.blog.create(createBlogData)
      if (createBlogResponse) {
        navigate("/blogs")
        navigate(0)
      }
    } catch (error: any) {
      toast.error("Failed to Create Blog", {
        description: error.message,
        duration: 5000,
      })
      console.error(`failed to create blog : ${error.message}`)
    }
  }

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
  const form = useForm<FieldValues>({
    defaultValues: {
      title: "",
      subtitle: "",
      handle: "",
      content: "",
      categories: [],
    },
  })

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
