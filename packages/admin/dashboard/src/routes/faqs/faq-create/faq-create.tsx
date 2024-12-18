import { Toaster } from "@medusajs/ui"
import { RouteFocusModal } from "../../../components/modals"
import { FieldValues, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import DynamicForm from "../../../components/custom/components/form/DynamicForm"
import { backendUrl } from "../../../lib/client"
import "react-quill/dist/quill.snow.css"
export const faqCreateSchema = {
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
  email: {
    label: "Email",
    fieldType: "input",
    validation: {
      required: {
        value: true,
        message: "Email is required",
      },
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Enter a valid email address",
      },
    },
  },
  faqType: {
    label: "Faq Type",
    fieldType: "input",
    validation: {
      required: {
        value: true,
        message: "Faq Type is required",
      },
    },
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
export const FaqCreate = () => {
  const navigate = useNavigate()

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

    console.log("====================================")
    console.log(raw)
    console.log("====================================")
    try {
      const createFaqResponse = await fetch(`${backendUrl}/admin/faqs`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(raw),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const createFaqResponseJson = await createFaqResponse.json()

      if (createFaqResponseJson) {
        navigate("/faqs")
        navigate(0)
      }
    } catch (error: any) {
      console.log(`failed to create faq : ${error.message}`)
    }
  }
  const form = useForm<FieldValues>({
    defaultValues: {
      faqTitle: "",
      faqContent: "",
      email: "",
      faqCategoryTitle: "",
      faqType: "",
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
            schema={faqCreateSchema}
          />
        </div>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
