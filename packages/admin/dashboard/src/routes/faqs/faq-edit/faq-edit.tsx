import { Toaster } from "@medusajs/ui"
import { RouteFocusModal } from "../../../components/modals"
import { useNavigate, useParams } from "react-router-dom"
import { FieldValues, useForm } from "react-hook-form"
import { sdk } from "../../../lib/client"
import { useEffect, useState, useCallback, useMemo } from "react"
import DynamicForm from "../../../components/custom/components/form/DynamicForm"
import { FaqCategoriesListProps } from "../faq-create/faq-create"

const fetchFaqById = async (id: string) => {
  try {
    const response = await sdk.admin.faq.retrieve(id)

    return response
  } catch (error: any) {
    console.error(`Failed to fetch faq with : ${id}`)
    console.log({
      error: `Failed to fetch faq with : ${id}`,
      message: error.message,
    })
  }
}

const fetchFaqCategories = async () => {
  try {
    const response = await sdk.admin.faq.listFaqCategories()

    return response
  } catch (error: any) {
    console.error(`Failed to fetch faqs`)
    console.log({ error: "Failed to fetch faqs", message: error.message })
  }
}

export const FaqEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<FaqCategoriesListProps[]>([])

  const form = useForm<FieldValues>({
    defaultValues: {
      faqTitle: "",
      faqContent: "",
      faqCategoryTitle: "",
      faqType: "",
      faqDisplayStatus: false,
      faqDefaultOpen: false,
    },
  })

  // Fetch categories and memoize the category options
  const loadFaqCategoriesData = useCallback(async () => {
    try {
      const data = await fetchFaqCategories()
      setCategories(data?.faqCategories || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }, [])

  useEffect(() => {
    loadFaqCategoriesData()
  }, [loadFaqCategoriesData])

  const optionsForCategory = useMemo(() => {
    return categories.map((x: any) => ({ value: x.title, label: x.title }))
  }, [categories])

  const faqUpdateSchema = {
    faqTitle: {
      label: "Faq Title",
      fieldType: "input",
      validation: {
        required: { value: true, message: "Title is required" },
        pattern: {
          value: /^(?!^\d+$)^.+$/,
          message: "Title should not contain only numbers",
        },
      },
    },
    faqContent: {
      label: "Faq Content",
      fieldType: "richText-editor",
      validation: { required: { value: true, message: "Content is required" } },
    },
    faqType: {
      label: "Faq Type",
      fieldType: "input",
      validation: {},
    },
    faqCategoryTitle: {
      label: "Faq Category",
      fieldType: "combobox",
      props: { options: optionsForCategory },
      validation: {
        required: { value: true, message: "Faq Category is required" },
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

  // Load FAQ data and populate form
  useEffect(() => {
    const loadFaq = async () => {
      try {
        const faqData = await fetchFaqById(id!)
        form.reset({
          faqTitle: faqData?.title || "",
          faqContent: faqData?.content || "",
          faqCategoryTitle: faqData?.category.title || "",
          faqType: faqData?.type || "",
          faqDisplayStatus: faqData?.display_status === "published",
          faqDefaultOpen: faqData?.by_admin || false,
          // metadata: Object.entries(faqData?.metadata || {}).map(
          //   ([key, value]) => ({
          //     key,
          //     value,
          //   })
          // ),
        })
      } catch (error) {
        console.error("Error loading faq:", error)
      }
    }
    loadFaq()
  }, [id, form])

  // Handle form submission
  const onSubmit = async (data: FieldValues) => {
    // const metadataObject = data.metadata.reduce(
    //   (acc: Record<string, string>, item: MetadataField) => {
    //     acc[item.key] = item.value
    //     return acc
    //   },
    //   {}
    // )

    const raw = {
      title: data.faqTitle,
      content: data.faqContent,
      type: data.faqType,
      by_admin: data.faqDefaultOpen,
      display_status: data.faqDisplayStatus
        ? ("published" as const)
        : ("draft" as const),
      email: data.email,
      category: { title: data.faqCategoryTitle },
    }

    try {
      // const response = await fetch(`${backendUrl}/admin/faqs/${id}`, {
      //   method: "PUT",
      //   credentials: "include",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(raw),
      // })
      const response = await sdk.admin.faq.update(id!, raw)
      if (response) {
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
      <RouteFocusModal.Body className="overflow-scroll">
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
