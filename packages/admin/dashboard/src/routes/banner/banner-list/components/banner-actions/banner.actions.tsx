import {
  EllipsisHorizontal,
  PencilSquare,
  SquareGreenSolid,
  SquareGreySolid,
  Trash,
} from "@medusajs/icons"
import { Button, DropdownMenu, toast } from "@medusajs/ui"
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

  const handleStatusChange = async (isActive: boolean) => {
    try {
      if (!banner.id) {
        throw new Error("Banner ID is missing")
      }

      const updateBannerData = {
        name: banner.name,
        link: banner.link,
        image: banner.image,
        description: banner.description,
        isActive: isActive, // Update status dynamically
      }

      const updateBannerResponse = (await sdk.admin.banner.update(
        banner.id, // Use banner.id directly
        updateBannerData
      )) as BannerProps
      navigate(0)
      return updateBannerResponse
    } catch (error: any) {
      toast.error("Failed to Update Banner", {
        description: error.message,
        duration: 5000,
      })
      console.error(`Failed to update banner: ${error.message}`)
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
        {banner.isActive === false && (
          <DropdownMenu.Item
            onClick={() => handleStatusChange(true)}
            className="gap-x-2"
          >
            <SquareGreenSolid className="text-ui-fg-subtle" />
            Published
          </DropdownMenu.Item>
        )}
        {banner.isActive === true && (
          <DropdownMenu.Item
            onClick={() => handleStatusChange(false)}
            className="gap-x-2"
          >
            <SquareGreySolid className="text-ui-fg-subtle" />
            Draft
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

export default BannerActions
