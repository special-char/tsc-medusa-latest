import { Toaster } from "@medusajs/ui"
import { RouteFocusModal } from "../../../components/modals"
import { useNavigate, useParams } from "react-router-dom"
import { FieldValues, useForm } from "react-hook-form"
import { backendUrl } from "../../../lib/client"
import { useEffect, useState, useCallback, useMemo } from "react"
import DynamicForm from "../../../components/custom/components/form/DynamicForm"
import { MetadataField } from "../../../components/custom/components/form/CustomMetaData"

// Abstracted fetch function for reusable API calls
const fetchData = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${url}`)
  }
  return response.json()
}

const fetchFaqById = async (id: string) =>
  fetchData(`${backendUrl}/admin/faqs/${id}`)
const fetchFaqCategories = async () =>
  fetchData(`${backendUrl}/admin/faqs/categories`)

export const FaqEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])

  const form = useForm<FieldValues>({
    defaultValues: {
      faqTitle: "",
      faqContent: "",
      faqCategoryTitle: "",
      faqType: "",
      faqDisplayStatus: false,
      metadata: [],
    },
  })

  // Fetch categories and memoize the category options
  const loadFaqCategoriesData = useCallback(async () => {
    try {
      const { faqCategories } = await fetchFaqCategories()
      setCategories(faqCategories || [])
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
    metadata: {
      label: "Metadata",
      fieldType: "metadata",
      validation: {},
    },
  }

  // Load FAQ data and populate form
  useEffect(() => {
    const loadFaq = async () => {
      try {
        const faqData = await fetchFaqById(id!)
        form.reset({
          faqTitle: faqData.title || "",
          faqContent: faqData.content || "",
          faqCategoryTitle: faqData.category.title || "",
          faqType: faqData.type || "",
          faqDisplayStatus: faqData.display_status === "published",
          metadata: Object.entries(faqData?.metadata || {}).map(
            ([key, value]) => ({
              key,
              value,
            })
          ),
        })
      } catch (error) {
        console.error("Error loading faq:", error)
      }
    }
    loadFaq()
  }, [id, form])

  // Handle form submission
  const onSubmit = async (data: FieldValues) => {
    const metadataObject = data.metadata.reduce(
      (acc: Record<string, string>, item: MetadataField) => {
        acc[item.key] = item.value
        return acc
      },
      {}
    )

    const raw = {
      title: data.faqTitle,
      content: data.faqContent,
      type: data.faqType,
      by_admin: true,
      display_status: data.faqDisplayStatus ? "published" : "draft",
      email: data.email,
      category: { title: data.faqCategoryTitle },
      metadata: metadataObject,
    }

    try {
      const response = await fetch(`${backendUrl}/admin/faqs/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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

// import { Toaster } from "@medusajs/ui"
// import { RouteFocusModal } from "../../../components/modals"
// import { useNavigate, useParams } from "react-router-dom"
// import { FieldValues, useForm } from "react-hook-form"
// import { backendUrl } from "../../../lib/client"
// import { useEffect, useState } from "react"
// import DynamicForm from "../../../components/custom/components/form/DynamicForm"
// import { MetadataField } from "../../../components/custom/components/form/CustomMetaData"

// const fetchFaqById = async (id: string) => {
//   const response = await fetch(`${backendUrl}/admin/faqs/${id}`, {
//     method: "GET",
//     credentials: "include",
//   })
//   if (!response.ok) {
//     throw new Error("Failed to fetch faq data")
//   }
//   return response.json()
// }

// export const FaqEdit = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()

//   const form = useForm<FieldValues>({
//     defaultValues: {
//       faqTitle: "",
//       faqContent: "",
//       faqCategoryTitle: "",
//       faqType: "",
//       faqDisplayStatus: false,
//       metadata: [],
//     },
//   })
//   const [categories, setCategories] = useState([])

//   const LoadFaqCategoriesData = async () => {
//     try {
//       const faqCategoriesResponse = await fetch(
//         `${backendUrl}/admin/faqs/categories`,
//         {
//           method: "GET",
//           credentials: "include",
//         }
//       )
//       const faqResponseJson = await faqCategoriesResponse.json()
//       setCategories(faqResponseJson?.faqCategories)
//     } catch (error: any) {
//       console.log(`Failed to fetch faq data : ${error}`)
//     }
//   }
//   useEffect(() => {
//     LoadFaqCategoriesData()
//   }, [])

//   const optionsForCategory = categories.map((x: any) => {
//     return { value: x.title, label: x.title }
//   })
//   const faqUpdateSchema = {
//     faqTitle: {
//       label: "Faq Title",
//       fieldType: "input",
//       validation: {
//         required: {
//           value: true,
//           message: "Title is required",
//         },
//         pattern: {
//           value: /^(?!^\d+$)^.+$/,
//           message: "Title should not contain only numbers",
//         },
//       },
//     },
//     faqContent: {
//       label: "Faq Content",
//       fieldType: "richText-editor",
//       validation: {
//         required: {
//           value: true,
//           message: "Content is required",
//         },
//       },
//     },
//     faqType: {
//       label: "Faq Type",
//       fieldType: "input",
//       validation: {},
//     },
//     faqCategoryTitle: {
//       label: "Faq Category",
//       fieldType: "combobox",
//       props: {
//         options: optionsForCategory,
//       },
//       validation: {
//         required: {
//           value: true,
//           message: "Faq Category is required",
//         },
//       },
//     },
//     faqDisplayStatus: {
//       label: "Faq Display Status",
//       fieldType: "toggle",
//       validation: {},
//     },
//     metadata: {
//       label: "Metadata",
//       fieldType: "metadata",
//       validation: {},
//     },
//   }
//   useEffect(() => {
//     const loadFaq = async () => {
//       try {
//         const faqData = await fetchFaqById(id!)
//         // const metadataArray = Object.entries(faqData?.metadata).map(
//         //   ([key, value]) => ({
//         //     key,
//         //     value,
//         //   })
//         // )
//         form.reset({
//           faqTitle: faqData.title || "",
//           faqContent: faqData.content || "",
//           faqCategoryTitle: faqData.category.title || "",
//           faqType: faqData.type || "",
//           faqDisplayStatus:
//             faqData.display_status === "published" ? true : false,
//           metadata:
//             Object.entries(faqData?.metadata).map(([key, value]) => ({
//               key,
//               value,
//             })) || [],
//         })
//       } catch (error) {
//         console.error("Error loading faq:", error)
//       }
//     }
//     loadFaq()
//   }, [])

//   const onSubmit = async (data: FieldValues) => {
//     const metadataObject = data.metadata.reduce(
//       (acc: Record<string, string>, item: MetadataField) => {
//         acc[item.key] = item.value
//         return acc
//       },
//       {}
//     )

//     const raw = {
//       title: data.faqTitle,
//       content: data.faqContent,
//       type: data.faqType,
//       by_admin: true,
//       display_status: data.faqDisplayStatus === true ? "published" : "draft",
//       email: data.email,
//       category: {
//         title: data.faqCategoryTitle,
//       },
//       metadata: metadataObject,
//     }
//     try {
//       const response = await fetch(`${backendUrl}/admin/faqs/${id}`, {
//         method: "PUT",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(raw),
//       })
//       if (response.ok) {
//         navigate("/faqs")
//         navigate(0)
//       } else {
//         console.error("Failed to update faq")
//       }
//     } catch (error) {
//       console.error("Error updating faq:", error)
//     }
//   }

//   return (
//     <RouteFocusModal>
//       <Toaster />
//       <RouteFocusModal.Header />
//       <RouteFocusModal.Body className="overflow-scroll">
//         <div className="w-full p-5">
//           <DynamicForm
//             form={form}
//             onSubmit={onSubmit}
//             schema={faqUpdateSchema}
//           />
//         </div>
//       </RouteFocusModal.Body>
//     </RouteFocusModal>
//   )
// }
