import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons"
import { Button, DropdownMenu } from "@medusajs/ui"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../../../../lib/client"
import { BannerProps } from "../banner-list-table"

const BannerActions = ({ banner }: { banner: BannerProps }) => {
  const navigate = useNavigate()
  const handleDelete = async () => {
    try {
      const deleteBannerResponse = await sdk.admin.banner.delete(banner.id)
      if (deleteBannerResponse) {
        navigate(0)
      }
    } catch (error: any) {
      console.log(`failed to delete Banner : ${error.message}`)
    }
  }
  console.log({ banner })

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
            navigate(`/banner/${banner.id}/banner-edit`, {
              state: banner,
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

export default BannerActions
