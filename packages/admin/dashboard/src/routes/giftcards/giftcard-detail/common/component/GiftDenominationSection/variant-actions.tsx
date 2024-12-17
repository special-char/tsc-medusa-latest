import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons"
import { Button, DropdownMenu } from "@medusajs/ui"
import { Link } from "react-router-dom"
import {
  useDeleteVariant,
  useProduct,
  useProductVariant,
  useUpdateProductOption,
} from "../../../../../../hooks/api"

const VariantActions = ({
  productId,
  variantId,
}: {
  productId: string
  variantId: string
}) => {
  const { variant } = useProductVariant(productId!, variantId!, undefined)
  const { product } = useProduct(
    variant?.product_id!,
    {
      fields: "-variants",
    },
    {
      enabled: !!variant?.product_id,
    }
  )

  const { mutateAsync } = useDeleteVariant(productId, variantId)
  const { mutateAsync: optionAsync } = useUpdateProductOption(
    product?.id || "",
    product?.options?.[0]?.id || ""
  )
  const handleDelete = async () => {
    const amounts = variant?.options?.map((option) => option.value) || []

    const optionsData = product?.options?.reduce(
      (p, c) => {
        const amountsFromOption =
          c?.values?.map((valueObj) => valueObj.value) || []
        p.title = c.title
        p.values = [...(p.values || []), ...amountsFromOption]
        return p
      },
      { title: "", values: [] } as { title: string; values: string[] }
    )
    if (optionsData) {
      optionsData.values = optionsData?.values.filter(
        (value) => !amounts.includes(value)
      )
    }
    try {
      await optionAsync({
        id: product?.options?.[0]?.id,
        ...optionsData,
      })
      await mutateAsync()
    } catch (error) {
      console.error("Error deleting variant or option:", error)
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
        <Button variant="secondary" size="small" className="w-6 h-6 p-0">
          <EllipsisHorizontal />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item asChild>
          <Link
            to={`/gift-cards/${productId}/edit-denomination?variant_id=${variantId}`}
            className="gap-x-2"
          >
            <PencilSquare className="text-ui-fg-subtle" />
            Edit
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => handleDelete()} className="gap-x-2">
          <Trash className="text-ui-fg-subtle" />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

export default VariantActions
