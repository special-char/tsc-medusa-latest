import { Button, IconButton, toast, Toaster } from "@medusajs/ui"
import { RouteFocusModal } from "../../../components/modals"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { FieldValues, useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { SchemaField } from "../../../components/custom/components/form/DynamicForm"
import { blogSchema, blogSEOSchema } from "../blogSchema"
import GenerateFormFields from "../../../components/custom/components/form/DynamicForm/GenerateFormFields"
import * as Accordion from "@radix-ui/react-accordion"
import { Plus } from "@medusajs/icons"
import { BlogProps } from "../blog-list/components/blog-list-table"
import { sdk } from "../../../lib/client"
export const BlogEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [schema, setSchema] = useState<Record<string, SchemaField>>({})
  const [seoSchema, setSeoSchema] = useState({})
  const [toggle, setToggle] = useState(false)

  const form = useForm<FieldValues>({
    defaultValues: {
      title: state.title,
      subtitle: state.subtitle,
      handle: state.handle,
      content: state.content,
      categories:
        state?.product_categories?.map((x: { id: string }) => x.id) || [],

      metaTitle: state.seo_details?.metaTitle ?? "",
      metaDescription: state.seo_details?.metaDescription ?? "",
      metaImage: state.seo_details?.metaImage ?? "",
      metaSocial: state.seo_details?.metaSocial || [],
      keywords: state.seo_details?.keywords ?? "",
      metaRobots: state.seo_details?.metaRobots ?? "",
      structuredData: JSON.stringify(
        state.seo_details?.structuredData?.structuredData || {}
      ),
      metaViewport: state.seo_details?.metaViewport ?? "",
      canonicalURL: state.seo_details?.canonicalURL ?? "",
    },
  })

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const schemaData = await blogSchema()
        const schemaSeoData = blogSEOSchema({ form, blogSeo: state })
        setSchema(schemaData)
        setSeoSchema(schemaSeoData)
      } catch (error) {
        console.error("Error loading schema:", error)
        toast.error("Failed to load schema")
      }
    }
    loadSchema()
  }, [])

  const onSubmit = async (data: FieldValues) => {
    try {
      console.log("====================================")
      console.log("data", data)
      console.log("====================================")
      const updateBlogData = {
        title: data.title,
        subtitle: data.subtitle,
        handle: data.handle,
        content: data.content,
        categories: data.categories,
      }
      const updateSeoBlogData = {
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords,
        metaViewport: data.metaViewport,
        metaRobots: data.metaRobots,
        structuredData: data.structuredData,
        canonicalURL: data.canonicalURL,
        metaImage: data.metaImage,
        metaSocial: data.metaSocial,
      }
      console.log("====================================")
      console.log("updateSeoBlogData", updateSeoBlogData)
      console.log("====================================")
      const updateBlogResponse = (await sdk.admin.blog.update(
        id!,
        updateBlogData
      )) as BlogProps
      console.log("====================================")
      console.log("updateBlogResponse", updateBlogResponse)
      console.log("====================================")
      if (toggle && updateBlogResponse) {
        if (state.seo_details) {
          await sdk.admin.blogSeo.update({
            id: updateBlogResponse.id,
            seoId: state.seo_details.id,
            body: updateSeoBlogData,
          })
        } else {
          await sdk.admin.blogSeo.create({
            id: updateBlogResponse.id,
            body: updateSeoBlogData,
          })
        }
      }
      navigate("/blogs")
      navigate(0)
    } catch (error: any) {
      toast.error("Failed to Update Blog", {
        description: error.message,
        duration: 5000,
      })
      console.error(`failed to Update blog : ${error.message}`)
    }
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
                    <GenerateFormFields form={form} schema={seoSchema} />
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
