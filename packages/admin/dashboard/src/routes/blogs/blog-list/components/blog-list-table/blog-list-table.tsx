import { Button, Container, Heading } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { sdk } from "../../../../../lib/client"
import BlogActions from "../blog-actions/blog.actions"
import { Link, Outlet } from "react-router-dom"
import { useTranslation } from "react-i18next"
import CustomTable from "../../../../../components/common/CustomTable"
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

export type BlogProps = {
  id: string
  title: string
  subtitle: string
  handle: string
  image: string | null
  content: string
  blogSeo: any | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  product_categories: { id: string }[]
  seo_details?: {
    id: string
    metaTitle: string
    metaDescription: string
    metaImage: string
    keywords: string
    metaRobots: string
    structuredData: string
    feedData: string
    metaViewport: string
    canonicalURL: string
    created_at: Date | string
    updated_at: Date | string
    deleted_at: Date | null
    metaSocial: {
      id: string
      title: string
      description: string
      image: string
      socialNetwork: "Twitter" | "Facebook"
      seo_details_id: string
      created_at: Date | string
      updated_at: Date | string
      deleted_at: Date | null
    }[]
  }
}

export const BlogListTable = () => {
  const [blogs, setBlogs] = useState<BlogProps[]>([])
  const LoadBlogData = async () => {
    try {
      const blogResponse = await sdk.admin.blog.list()

      setBlogs(blogResponse?.blogs)
    } catch (error: any) {
      console.log(`Failed to fetch blog data:${error}`)
    }
  }
  useEffect(() => {
    LoadBlogData()
  }, [])

  const columnHelper = createColumnHelper<any>()
  const columns = [
    columnHelper.display({
      header: "Sr. No.",
      id: "sr_no",
      cell: (info) => info.row.index + 1,
    }),
    columnHelper.accessor("title", {
      header: "Title",
      cell: (info) => (
        <span className="line-clamp-1 overflow-hidden">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("subtitle", {
      header: "Subtitle",
      cell: (info) => (
        <span className="line-clamp-1 overflow-hidden">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("handle", {
      header: "Handle",
      cell: (info) => (
        <span className="line-clamp-1 overflow-hidden">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("updated_at", {
      header: "Last Updated",
      cell: (info) => (
        <span className="line-clamp-1 overflow-hidden">{info.getValue()}</span>
      ),
    }),
    columnHelper.display({
      header: "Actions",
      id: "actions",
      cell: (info) => {
        return <BlogActions blog={info.row.original} />
      },
    }),
  ]

  const table = useReactTable<any>({
    data: blogs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const { t } = useTranslation()
  return (
    <Container className="divide-y overflow-hidden p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>Blogs</Heading>
        <Button size="small" variant="secondary" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>
      {blogs.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center gap-4 py-12 text-center">
          <h3 className="text-xl font-semibold tracking-tight">
            No Blogs found
          </h3>
          <p className="text-muted-foreground text-sm">
            Get started by creating your first Blog to help your users.
          </p>
          <Button size="small" variant="secondary" asChild>
            <Link to="create">{t("actions.create")}</Link>
          </Button>
        </div>
      ) : (
        <CustomTable PAGE_SIZE={10} data={blogs} table={table} />
      )}
      <Outlet />
    </Container>
  )
}
