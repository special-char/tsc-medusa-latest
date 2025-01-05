import { Toaster } from "@medusajs/ui"
import { RouteFocusModal } from "../../../components/modals"
import { FieldValues, useForm } from "react-hook-form"
import { sdk } from "../../../lib/client"
import { useNavigate } from "react-router-dom"
import DynamicForm from "../../../components/custom/components/form/DynamicForm"
export const blogCreateSchema = {
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
  handle: {
    label: "Blog Handle",
    fieldType: "input",
    validation: {
      pattern: {
        value: /^(?!^\d+$)^.+$/,
        message: "Handle should not contain only numbers",
      },
    },
  },
  content: {
    label: "Blog Content",
    fieldType: "markdown-editor",
    validation: {
      required: {
        value: true,
        message: "content is required",
      },
    },
  },
}

export const BlogCreate = () => {
  const navigate = useNavigate()

  const onSubmit = async (data: FieldValues) => {
    try {
      // const createBlogResponse = await fetch(`${backendUrl}/admin/blogs`, {
      //   method: "POST",
      //   credentials: "include",
      //   body: JSON.stringify(data),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // })
      // const createBlogResponseJson = await createBlogResponse.json()
      const createBlogData = {
        title: data.title,
        subtitle: data.subtitle,
        handle: data.handle,
        content: data.content,
      }
      const createBlogResponse = await sdk.admin.blog.create(createBlogData)
      if (createBlogResponse) {
        navigate("/blogs")
        navigate(0)
      }
    } catch (error: any) {
      console.log(`failed to create blog : ${error.message}`)
    }
  }
  const form = useForm<FieldValues>({
    defaultValues: {
      title: "",
      subtitle: "",
      handle: "",
      content: "",
    },
  })

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
