import { Toaster } from "@medusajs/ui"
import { RouteFocusModal } from "../../../components/modals"
import { FieldValues, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import DynamicForm from "../../../components/custom/components/form/DynamicForm"
import { sdk } from "../../../lib/client"
import "react-quill/dist/quill.snow.css"
import { useEffect, useState } from "react"
import { FaqProps } from "../faq-list/components/faq-list-table"
export type FaqCategoriesListProps = {
  id: string
  title: string
  description: string
  metadata: Record<string, any>
  handle: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  faqs: Omit<FaqProps, "category">[]
}

export const FaqCreate = () => {
  const [categories, setCategories] = useState<FaqCategoriesListProps[]>([])
  const LoadFaqCategoriesData = async () => {
    try {
      // const faqCategoriesResponse = await fetch(
      //   `${backendUrl}/admin/faqs/categories`,
      //   {
      //     method: "GET",
      //     credentials: "include",
      //   }
      // )
      // const faqResponseJson = await faqCategoriesResponse.json()
      const faqCategoriesResponse = await sdk.admin.faq.listFaqCategories()

      setCategories(faqCategoriesResponse?.faqCategories)
    } catch (error: any) {
      console.log(`Failed to fetch faq data : ${error}`)
    }
  }
  useEffect(() => {
    LoadFaqCategoriesData()
  }, [])

  const optionsForCategory = categories.map((x: any) => {
    return { value: x.title, label: x.title }
  })

  const faqCreateSchema = {
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
    faqCategoryTitle: {
      label: "Faq Category",
      fieldType: "combobox",
      props: {
        options: optionsForCategory,
        placeholder: "Select an Category...",
      },
      validation: {
        required: {
          value: true,
          message: "Category is required",
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
    faqDisplayStatus: {
      label: "Faq Display Status",
      fieldType: "toggle",
      validation: {},
    },
    faqDefaultOpen: {
      label: "Default Open",
      fieldType: "toggle",
      validation: {},
    },
    // metadata: {
    //   label: "Metadata",
    //   fieldType: "metadata",
    //   validation: {},
    // },
  }

  const navigate = useNavigate()

  const onSubmit = async (data: FieldValues) => {
    const raw = {
      title: data.faqTitle,
      content: data.faqContent,
      type: data.faqType,
      by_admin: data.faqDefaultOpen,
      display_status:
        data.faqDisplayStatus === true
          ? ("published" as const)
          : ("draft" as const),
      email: data.email,
      category: {
        title: data.faqCategoryTitle,
      },
    }

    try {
      // const createFaqResponse = await fetch(`${backendUrl}/admin/faqs`, {
      //   method: "POST",
      //   credentials: "include",
      //   body: JSON.stringify(raw),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // })
      // const createFaqResponseJson = await createFaqResponse.json()

      const createFaqResponse = await sdk.admin.faq.create(raw)
      if (createFaqResponse) {
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
      display_status: false,
      faqDefaultOpen: false,
    },
  })

  return (
    <RouteFocusModal>
      <Toaster />
      <RouteFocusModal.Header />
      <RouteFocusModal.Body className="overflow-scroll">
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
