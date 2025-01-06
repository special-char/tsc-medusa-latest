import { Toaster } from "@medusajs/ui"
import { RouteFocusModal } from "../../../components/modals"
import { useNavigate, useParams } from "react-router-dom"
import { FieldValues, useForm } from "react-hook-form"
import { sdk } from "../../../lib/client"
import { blogCreateSchema } from "../blog-create/blog-create"
import { useEffect } from "react"
import DynamicForm from "../../../components/custom/components/form/DynamicForm"

const fetchBlogById = async (id: string) => {
  const response = await sdk.admin.blog.retrieve(id)

  if (!response) {
    throw new Error("Failed to fetch blog data")
  }
  return response

  // const response = await fetch(`${backendUrl}/admin/blogs/${id}`, {
  //   method: "GET",
  //   credentials: "include",
  // })

  // if (!response.ok) {
  //   throw new Error("Failed to fetch blog data")
  // }

  // return response.json()
}

export const BlogEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const form = useForm<FieldValues>({
    defaultValues: {
      title: "",
      subtitle: "",
      handle: "",
      content: "",
    },
  })

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blogData = await fetchBlogById(id!)
        form.reset({
          title: blogData.title || "",
          subtitle: blogData.subtitle || "",
          handle: blogData.handle || "",
          content: blogData.content || "",
        })
      } catch (error) {
        console.error("Error loading blog:", error)
      }
    }
    loadBlog()
  }, [])

  const onSubmit = async (data: FieldValues) => {
    try {
      // const response = await fetch(`${backendUrl}/admin/blogs/${id}`, {
      //   method: "PUT",
      //   credentials: "include",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // })
      const response = await sdk.admin.blog.update(id!, data)

      if (response) {
        navigate("/blogs")
        navigate(0)
      } else {
        console.error("Failed to update blog")
      }
    } catch (error) {
      console.error("Error updating blog:", error)
    }
  }

  return (
    <RouteFocusModal>
      <Toaster />
      <RouteFocusModal.Header />
      <RouteFocusModal.Body>
        <div className="w-full p-5">
          <DynamicForm
            form={form}
            onSubmit={onSubmit}
            schema={blogCreateSchema}
          />
        </div>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
