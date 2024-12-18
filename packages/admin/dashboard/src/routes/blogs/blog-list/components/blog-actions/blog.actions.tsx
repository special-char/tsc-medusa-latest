import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons"
import { Button, DropdownMenu } from "@medusajs/ui"
import { Link, useNavigate } from "react-router-dom"
import { backendUrl } from "../../../../../lib/client"

const BlogActions = ({ blogId }: { blogId: string }) => {
  const navigate = useNavigate()
  const handleDelete = async () => {
    try {
      const deleteBlogResponse = await fetch(
        `${backendUrl}/admin/blogs/${blogId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      )
      if (deleteBlogResponse.ok) {
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
        <DropdownMenu.Item asChild>
          <Link to={`/blogs/${blogId}/blog-edit`} className="gap-x-2">
            <PencilSquare className="text-ui-fg-subtle" />
            Edit
          </Link>
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
