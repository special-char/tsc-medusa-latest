import { Toaster } from "@medusajs/ui"
import { RouteFocusModal } from "../../../components/modals"
import { useNavigate, useParams } from "react-router-dom"
import { FieldValues, useForm } from "react-hook-form"
import { backendUrl } from "../../../lib/client"
import { useEffect } from "react"
import DynamicForm from "../../../components/custom/components/form/DynamicForm"
export const faqUpdateSchema = {
  faqTitle: {
    label: "Faq Title",
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
  faqContent: {
    label: "Faq Content",
    fieldType: "richText-editor",
    validation: {
      required: {
        value: true,
        message: "Content is required",
      },
    },
  },
  faqType: {
    label: "Faq Type",
    fieldType: "input",
    validation: {},
  },
  faqCategoryTitle: {
    label: "Faq Category",
    fieldType: "input",
    validation: {
      required: {
        value: true,
        message: "Faq Category is required",
      },
    },
  },
}

const fetchFaqById = async (id: string) => {
  const response = await fetch(`${backendUrl}/admin/faqs/${id}`, {
    method: "GET",
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error("Failed to fetch faq data")
  }
  return response.json()
}

export const FaqEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const form = useForm<FieldValues>({
    defaultValues: {
      faqTitle: "",
      faqContent: "",
      faqCategoryTitle: "",
      faqType: "",
    },
  })

  useEffect(() => {
    const loadFaq = async () => {
      try {
        const faqData = await fetchFaqById(id!)
        form.reset({
          faqTitle: faqData.title || "",
          faqContent: faqData.content || "",
          faqCategoryTitle: faqData.category.title || "",
          faqType: faqData.type || "",
        })
      } catch (error) {
        console.error("Error loading faq:", error)
      }
    }
    loadFaq()
  }, [])

  const onSubmit = async (data: FieldValues) => {
    const raw = {
      title: data.faqTitle,
      content: data.faqContent,
      type: data.faqType,
      by_admin: true,
      email: data.email,
      category: {
        title: data.faqCategoryTitle,
      },
    }
    try {
      const response = await fetch(`${backendUrl}/admin/faqs/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(raw),
      })
      if (response.ok) {
        navigate("/faqs")
        navigate(0)
      } else {
        console.error("Failed to update faq")
      }
    } catch (error) {
      console.error("Error updating faq:", error)
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
            schema={faqUpdateSchema}
          />
        </div>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
