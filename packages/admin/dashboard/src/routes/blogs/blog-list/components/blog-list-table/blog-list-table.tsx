import { Button, Container, Heading, Table } from "@medusajs/ui"
import { useEffect, useState } from "react"

import { backendUrl } from "../../../../../lib/client"
import { DateCell } from "../../../../../components/table/table-cells/common/date-cell"
import BlogActions from "../blog-actions/blog.actions"
import { Link, Outlet } from "react-router-dom"
import { useTranslation } from "react-i18next"

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
}

export const BlogListTable = () => {
  const [blogs, setBlogs] = useState([])
  const LoadBlogData = async () => {
    try {
      const blogResponse = await fetch(`${backendUrl}/admin/blogs`, {
        method: "GET",
        credentials: "include",
      })
      const blogResponseJson = await blogResponse.json()
      setBlogs(blogResponseJson?.blogs)
    } catch (error: any) {
      console.log(`Failed to fetch blog data:${error}`)
    }
  }
  useEffect(() => {
    LoadBlogData()
  }, [])

  const { t } = useTranslation()
  return (
    <Container className="divide-y overflow-hidden p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>Blogs</Heading>
        <Button size="small" variant="secondary" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Sr. No</Table.HeaderCell>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>subtitle</Table.HeaderCell>
            <Table.HeaderCell>Handle</Table.HeaderCell>
            <Table.HeaderCell>Last Updated</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {blogs
            ?.sort(
              (a: BlogProps, b: BlogProps) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            )
            .map((blog: BlogProps, index) => {
              return (
                <Table.Row
                  key={blog.id}
                  className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap"
                >
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{blog.title}</Table.Cell>
                  <Table.Cell>{blog.subtitle}</Table.Cell>
                  <Table.Cell>{blog.handle}</Table.Cell>
                  <Table.Cell>
                    <DateCell date={blog.updated_at} />
                  </Table.Cell>
                  <Table.Cell>
                    <BlogActions blogId={blog.id} />
                  </Table.Cell>
                </Table.Row>
              )
            })}
        </Table.Body>
      </Table>
      <Outlet />
    </Container>
  )
}
