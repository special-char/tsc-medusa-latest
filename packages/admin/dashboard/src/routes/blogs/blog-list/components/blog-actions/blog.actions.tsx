import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons"
import { Button, DropdownMenu } from "@medusajs/ui"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../../../../lib/client"
import { BlogProps } from "../blog-list-table"

const BlogActions = ({ blog }: { blog: BlogProps }) => {
  const navigate = useNavigate()
  const handleDelete = async () => {
    try {
      const deleteBlogResponse = await sdk.admin.blog.delete(blog.id)
      if (deleteBlogResponse) {
        navigate(0)
      }
    } catch (error: any) {
      console.log(`failed to delete Blog : ${error.message}`)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger
        asChild
        onChange={(e) => {
          console.log(e)
        }}
      >
        <Button variant="secondary" size="small" className="h-6 w-6 p-0">
          <EllipsisHorizontal />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item
          onClick={() => {
            navigate(`/blogs/${blog.id}/blog-edit`, {
              state: blog,
            })
          }}
          className="gap-x-2"
        >
          <PencilSquare className="text-ui-fg-subtle" />
          Edit
        </DropdownMenu.Item>

        <DropdownMenu.Item onClick={handleDelete} className="gap-x-2">
          <Trash className="text-ui-fg-subtle" />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

export default BlogActions
