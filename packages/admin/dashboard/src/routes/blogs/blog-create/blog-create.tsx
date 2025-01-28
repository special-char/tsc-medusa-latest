import { Button, IconButton, toast, Toaster } from "@medusajs/ui"
import { RouteFocusModal } from "../../../components/modals"
import { FieldValues, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { blogSchema, blogSEOSchema } from "../blogSchema"
import { sdk } from "../../../lib/client"
import GenerateFormFields from "../../../components/custom/components/form/DynamicForm/GenerateFormFields"
import { BlogProps } from "../blog-list/components/blog-list-table"
import * as Accordion from "@radix-ui/react-accordion"
import { Plus } from "@medusajs/icons"

export const BlogCreate = () => {
  const navigate = useNavigate()
  const [schema, setSchema] = useState({})
  const [seoSchema, setSeoSchema] = useState({})
  const [toggle, setToggle] = useState(false)

  const onSubmit = async (data: FieldValues) => {
    try {
      const createBlogData = {
        title: data.title,
        subtitle: data.subtitle,
        handle: data.handle,
        content: data.content,
        categories: data.categories,
      }
      const createSeoBlogData = {
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
      const createBlogResponse = (await sdk.admin.blog.create(
        createBlogData
      )) as BlogProps
      if (toggle && createBlogResponse) {
        await sdk.admin.blogSeo.create(createBlogResponse.id, createSeoBlogData)
      }
      navigate("/blogs")
      navigate(0)
    } catch (error: any) {
      toast.error("Failed to Create Blog", {
        description: error.message,
        duration: 5000,
      })
      console.error(`failed to create blog : ${error.message}`)
    }
  }
  const form = useForm<FieldValues>({
    defaultValues: {
      title: "",
      subtitle: "",
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
        const schemaSeoData = blogSEOSchema({ form, blogSeo: {} })
        setSchema(schemaData)
        setSeoSchema(schemaSeoData)
      } catch (error) {
        console.error("Error loading schema:", error)
        toast.error("Failed to load schema")
      }
    }
    loadSchema()
  }, [])

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
