import { Button, IconButton, toast, Toaster } from "@medusajs/ui"
import { RouteFocusModal } from "../../../components/modals"
import { FieldValues, useForm } from "react-hook-form"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { SchemaField } from "../../../components/custom/components/form/DynamicForm"
import { blogSchema, blogSEOSchema } from "../blogSchema"
import GenerateFormFields from "../../../components/custom/components/form/DynamicForm/GenerateFormFields"
import * as Accordion from "@radix-ui/react-accordion"
import { Plus } from "@medusajs/icons"

interface BlogFormProps {
  initialData?: FieldValues
  onSubmit: (data: FieldValues) => Promise<void>
  isEditMode: boolean
  toggle: boolean
  setToggle: Dispatch<SetStateAction<boolean>>
}

export const BlogForm = ({
  initialData,
  onSubmit,
  isEditMode,
  toggle,
  setToggle,
}: BlogFormProps) => {
  const [schema, setSchema] = useState<Record<string, SchemaField>>({})
  const [seoSchema, setSeoSchema] = useState({})

  const form = useForm<FieldValues>({
    defaultValues:
      isEditMode && initialData
        ? {
            title: initialData?.title,
            subtitle: initialData?.subtitle,
            image: initialData?.image,
            handle: initialData?.handle,
            content: initialData?.content,
            categories:
              initialData?.product_categories?.map(
                (x: { id: string }) => x.id
              ) || [],

            metaTitle: initialData?.seo_details?.metaTitle ?? "",
            metaDescription: initialData?.seo_details?.metaDescription ?? "",
            metaImage: initialData?.seo_details?.metaImage ?? "",
            metaSocial:
              Array.isArray(initialData?.seo_details?.metaSocial) &&
              initialData?.seo_details?.metaSocial?.length > 0
                ? [
                    ...initialData.seo_details.metaSocial.map((item: any) => ({
                      ...item,
                      socialNetwork: item.socialNetwork || "Facebook",
                      title: item.title || "",
                      description: item.description || "",
                      image: item.image || "",
                    })),
                  ]
                : undefined,
            keywords: initialData?.seo_details?.keywords ?? "",
            metaRobots: initialData?.seo_details?.metaRobots ?? "",
            structuredData: JSON.stringify(
              initialData?.seo_details?.structuredData?.structuredData || {}
            ),
            metaViewport: initialData?.seo_details?.metaViewport ?? "",
            canonicalURL: initialData?.seo_details?.canonicalURL ?? "",
          }
        : {
            title: "",
            subtitle: "",
            image: "",
            handle: "",
            content: "",
            categories: [],

            metaTitle: "",
            metaDescription: "",
            metaImage: "",
            metaSocial: [],
            keywords: "",
            metaRobots: "",
            structuredData: "{}",
            metaViewport: "",
            canonicalURL: "",
          },
  })

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const schemaData = await blogSchema()
        const schemaSeoData = blogSEOSchema({
          form,
          blogSeo: initialData ? initialData?.seo_details : {},
        })
        setSchema(schemaData)
        setSeoSchema(schemaSeoData)
      } catch (error) {
        console.error("Error loading schema:", error)
        toast.error("Failed to load schema")
      }
    }
    loadSchema()
  }, [initialData])

  useEffect(() => {
    const { metaTitle, metaDescription } = form.getValues()
    if (metaTitle || metaDescription) {
      setToggle(true)
    }
  }, [form])
  return (
    <RouteFocusModal>
      <Toaster />
      <RouteFocusModal.Header />
      <RouteFocusModal.Body className="overflow-auto">
        <div className="w-full p-5">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-y-3"
          >
            <GenerateFormFields form={form} schema={schema} />

            <div className="rounded-md border">
              <Accordion.Root
                type="multiple"
                defaultValue={toggle ? ["true"] : []}
              >
                <Accordion.Item
                  value="true"
                  className="border-ui-border-base border-b last-of-type:border-b-0"
                >
                  <Accordion.Header className="h3-core text-ui-fg-base group flex w-full flex-1 items-center gap-4 px-6 py-2">
                    Blog Seo
                    <Accordion.Trigger
                      asChild
                      className="ml-auto"
                      onClick={() => setToggle((prev) => !prev)}
                    >
                      <IconButton variant="transparent">
                        <Plus className="transform transition-transform group-data-[state=open]:rotate-45" />
                      </IconButton>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden py-5 pl-[88px] pr-6">
                    <div className="flex flex-col gap-4 ">
                      <GenerateFormFields form={form} schema={seoSchema} />
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={
                          form.formState.isLoading ||
                          form.formState.isSubmitting
                        }
                        onClick={() => {
                          const metaSocial = form.getValues("metaSocial")
                          form.reset({
                            metaTitle: " ",
                            metaDescription: " ",
                            metaImage: null,
                            metaSocial: metaSocial.map((item: any) => ({
                              ...item,
                              isDeleted: true,
                            })),
                            keywords: " ",
                            metaRobots: " ",
                            structuredData: JSON.stringify({}),
                            metaViewport: " ",
                            canonicalURL: " ",
                          })
                        }}
                      >
                        Reset Seo Form
                      </Button>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </div>
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
