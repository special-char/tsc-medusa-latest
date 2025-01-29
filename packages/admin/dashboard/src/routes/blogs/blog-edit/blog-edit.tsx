import { FieldValues } from "react-hook-form"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { sdk } from "../../../lib/client"
import { BlogProps } from "../blog-list/components/blog-list-table"
import { toast } from "@medusajs/ui"
import { BlogForm } from "../blog-form"
import { useState } from "react"

export const BlogEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [toggle, setToggle] = useState(false)

  const onSubmit = async (data: FieldValues) => {
    try {
      const updateBlogData = {
        title: data.title,
        subtitle: data.subtitle,
        image: data.image,
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

      const updateBlogResponse = (await sdk.admin.blog.update(
        id!,
        updateBlogData
      )) as BlogProps
      if (toggle && updateBlogResponse) {
        if (state.seo_details) {
          await sdk.admin.blogSeo.update(
            updateBlogResponse.id,
            state.seo_details.id,
            updateSeoBlogData
          )
        } else {
          await sdk.admin.blogSeo.create(
            updateBlogResponse.id,
            updateSeoBlogData
          )
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
  }

  return (
    <BlogForm
      initialData={state}
      onSubmit={onSubmit}
      isEditMode={true}
      setToggle={setToggle}
      toggle={toggle}
    />
  )
}
