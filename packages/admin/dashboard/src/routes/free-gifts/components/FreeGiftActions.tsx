import { PencilSquare, Trash } from "@medusajs/icons"
import { FreeProductsDTO } from "../type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usePrompt } from "@medusajs/ui"
import { ActionMenu } from "../../../widgets/product-variant-images/components/ActionMenu"
import { sdk } from "../../../lib/client"

const FreeGiftActions = ({ data }: { data: FreeProductsDTO }) => {
  const prompt = usePrompt()
  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationFn: (id: string) =>
      sdk.client.fetch(`/admin/free-product/${id}`, {
        method: "DELETE",
        credentials: "include",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["free-products-list"] })
    },
  })

  const handleDelete = async () => {
    const res = await prompt({
      title: "Are you sure?",
      description: "This will delete the free product.",
    })
    if (res) {
      await mutateAsync(data.id)
    }
  }

  return (
    <div className="flex justify-end">
      <ActionMenu
        groups={[
          {
            actions: [
              {
                icon: <PencilSquare />,
                label: "Edit",
                to: `/free-gifts/${data.id}`,
              },
              {
                icon: <Trash />,
                label: "Delete",
                onClick: handleDelete,
              },
            ],
          },
        ]}
      />
    </div>
  )
}

export default FreeGiftActions
