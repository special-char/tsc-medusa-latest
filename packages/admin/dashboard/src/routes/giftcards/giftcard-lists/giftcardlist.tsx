import { Badge, Button, Container, DropdownMenu, Heading } from "@medusajs/ui"
import { Link, Outlet } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  useProducts,
  useUpdateProduct,
  useDeleteProduct,
} from "../../../hooks/api"
import {
  EllipseGreenSolid,
  EllipseGreySolid,
  EllipsisHorizontal,
  Eye,
  EyeSlash,
  PencilSquare,
  Trash,
} from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

const RenderItem = ({
  product,
  setGiftcards,
}: {
  product: HttpTypes.AdminProduct
  setGiftcards: React.Dispatch<React.SetStateAction<any[]>>
}) => {
  const { mutateAsync: updateMutate } = useUpdateProduct(product.id)
  const { mutateAsync: deleteMutate } = useDeleteProduct(product.id)

  const handleDelete = async (productId: string) => {
    await deleteMutate()
    setGiftcards((prev) => prev.filter((p) => p.id !== productId))
  }

  const setProductStatus = async (product: HttpTypes.AdminProduct) => {
    const newStatus = product.status === "published" ? "draft" : "published"
    await updateMutate({
      status: newStatus,
    })
    setGiftcards((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
    )
  }

  return (
    <Container className="p-8 grid grid-cols-[auto_1fr_auto] gap-4">
      <div className="shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-[8px]">
        <img
          src={product.thumbnail || ""}
          alt={product.title}
          className="w-36 aspect-square object-cover"
        />
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <Heading level="h1" className="font-bold line-clamp-2">
            {product.title}
          </Heading>
          <p className="line-clamp-1">{product.description}</p>
        </div>
        <div className="flex flex-row gap-4">
          {product?.variants &&
            product?.variants?.length > 0 &&
            product?.variants?.map((variant) => {
              return (
                <>
                  {variant?.options && !variant?.options[0]?.metadata && (
                    <Badge>
                      {variant?.prices && variant?.prices[0]?.amount}{" "}
                      {variant?.prices && variant?.prices[0]?.currency_code}
                    </Badge>
                  )}
                </>
              )
            })}
        </div>
      </div>
      <div className="flex flex-col justify-between items-end">
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button variant="secondary" size="small" className="w-6 h-6 p-0">
              <EllipsisHorizontal />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item asChild>
              <Link to={`/gift-cards/${product.id}`} className="gap-x-2">
                <PencilSquare className="text-ui-fg-subtle" />
                Edit
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => setProductStatus(product)}
              className="gap-x-2"
            >
              {product.status === "published" ? (
                <EyeSlash className="text-ui-fg-subtle" />
              ) : (
                <Eye className="text-ui-fg-subtle" />
              )}
              {product.status === "published" ? "Unpublish" : "Publish"}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => handleDelete(product.id)}
              className="gap-x-2"
            >
              <Trash className="text-ui-fg-subtle" />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
        <div className="flex items-center gap-2">
          {product.status === "published" ? (
            <EllipseGreenSolid />
          ) : (
            <EllipseGreySolid />
          )}
          <p className="capitalize">{product.status}</p>
        </div>
      </div>
    </Container>
  )
}

export const GiftCardList = () => {
  const [giftcards, setGiftcards] = useState([])
  const { t } = useTranslation()
  const { products } = useProducts({ is_giftcard: true })

  useEffect(() => {
    setGiftcards(products as any)
  }, [products])

  return (
    <div className="p-0 flex flex-col gap-4">
      <Container className="flex flex-col gap-2 p-8">
        <Heading level="h1" className="font-bold">
          Gift Cards
        </Heading>
        <p className="text-sm">Manage the Gift Cards of your medusa store</p>
      </Container>
      <Container className="flex flex-col gap-6 p-8">
        <div className="flex flex-col gap-2">
          <Heading level="h2" className="font-bold">
            Are you ready to sell your first Gift Card?
          </Heading>
          <p className="text-sm">No Gift Card has been added yet.</p>
        </div>
        <Button size="small" variant="secondary" asChild>
          <Link to="create">{t("giftCards.createGiftCard")}</Link>
        </Button>
        <Outlet />
      </Container>

      {giftcards &&
        giftcards?.map((product: HttpTypes.AdminProduct) => {
          return (
            <RenderItem
              key={product?.id}
              product={product}
              setGiftcards={setGiftcards as Dispatch<SetStateAction<any[]>>}
            />
          )
        })}
    </div>
  )
}
