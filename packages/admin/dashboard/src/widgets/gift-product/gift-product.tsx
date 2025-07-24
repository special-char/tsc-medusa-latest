import { Container, Heading, Label, Switch, toast } from "@medusajs/ui"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { sdk } from "../../lib/client"

const GiftProduct = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const [value, setValue] = useState(data.is_giftcard || false)

  const { mutate, isError, isPending } = useMutation({
    mutationFn: async ({ id, isGift }: { id: string; isGift: boolean }) => {
      sdk.admin.product.update(id, {
        is_giftcard: isGift,
      })
    },
    onError: (error) => {
      console.error("Error updating gift product status:", error)
      toast.error("Failed to update gift product status.", {
        description: error.message || "An unexpected error occurred.",
      })
    },
    onSuccess: () => {
      console.log("Gift product status updated successfully")
      toast.success("Product status updated successfully.")
    },
  })

  const onChange = (checked: boolean) => {
    setValue(checked)
    mutate({ id: data.id, isGift: checked })
    console.log("Gift product status changed:", checked)
  }

  return (
    <Container className="divide-y p-0 font-sans">
      <Heading level="h2" className="px-6 py-4 font-medium">
        Gift Product
      </Heading>
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <Label
          htmlFor="is_giftcard"
          className="txt-compact-small text-ui-fg-subtle font-sans font-medium"
        >
          Is Gift Product?
        </Label>
        <Switch
          id="is_giftcard"
          disabled={isPending || isError}
          checked={value}
          onCheckedChange={onChange}
        />
      </div>
    </Container>
  )
}

export default GiftProduct
