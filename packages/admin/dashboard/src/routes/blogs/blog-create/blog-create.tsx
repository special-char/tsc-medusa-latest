import { FieldValues } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { BlogProps } from "../blog-list/components/blog-list-table"
import { toast } from "@medusajs/ui"
import { sdk } from "../../../lib/client"
import { BlogForm } from "../blog-form"
import { useState } from "react"

export const BlogCreate = () => {
  const navigate = useNavigate()
  const [toggle, setToggle] = useState(false)
  const onSubmit = async (data: FieldValues) => {
    try {
      const createBlogData = {
        title: data.title,
        subtitle: data.subtitle,
        image: data.image,
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
        feedData: data.feedData,
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

  return (
    <BlogForm
      onSubmit={onSubmit}
      isEditMode={false}
      setToggle={setToggle}
      toggle={toggle}
    />
  )
}
