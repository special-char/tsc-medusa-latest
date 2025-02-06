import { Buildings, Component, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes, InventoryItemDTO } from "@medusajs/types"
import { Badge, Checkbox, clx, usePrompt } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useDeleteVariant } from "../../../hooks/api"
import { Action, ActionMenu } from "../../../components/common/action-menu"
import { PlaceholderCell } from "../../../components/table/table-cells/common/placeholder-cell"

const GiftVariantActions = ({
  variant,
  product,
}: {
  variant: HttpTypes.AdminProductVariant & {
    inventory_items: { inventory: InventoryItemDTO }[]
  }
  product: HttpTypes.AdminProduct
}) => {
  const { mutateAsync } = useDeleteVariant(product.id, variant.id)
  const { t } = useTranslation()
  const prompt = usePrompt()

  const inventoryItemsCount = variant.inventory_items?.length || 0
  const hasInventoryItem = inventoryItemsCount === 1
  const hasInventoryKit = inventoryItemsCount > 1

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("products.deleteVariantWarning", {
        title: variant.title,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync()
  }

  const [inventoryItemLink, inventoryKitLink] = useMemo(() => {
    if (!variant.inventory_items?.length) {
      return ["", ""]
    }

    const itemId = variant.inventory_items![0].inventory.id
    const itemLink = `/inventory/${itemId}`

    const itemIds = variant.inventory_items!.map((i) => i.inventory.id)
    const params = { id: itemIds }
    const query = new URLSearchParams(params).toString()

    const kitLink = `/inventory?${query}`

    return [itemLink, kitLink]
  }, [variant.inventory_items])

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            hasInventoryItem
              ? {
                  label: t("products.variant.inventory.actions.inventoryItems"),
                  to: inventoryItemLink,
                  icon: <Buildings />,
                }
              : false,
            hasInventoryKit
              ? {
                  label: t("products.variant.inventory.actions.inventoryKit"),
                  to: inventoryKitLink,
                  icon: <Component />,
                }
              : false,
          ].filter(Boolean) as Action[],
        },
        {
          actions: [
            {
              label: t("actions.delete"),
              onClick: handleDelete,
              icon: <Trash />,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminProductVariant>()

export const useProductGiftVariantTableColumns = (
  product?: HttpTypes.AdminProduct
) => {
  const { t } = useTranslation()

  const optionColumns = useMemo(() => {
    if (!product?.options) {
      return []
    }

    return product.options.map((option) => {
      return columnHelper.display({
        id: option.id,
        header: () => (
          <div className="flex h-full w-full items-center">
            <span className="truncate">{option.title}</span>
          </div>
        ),
        cell: ({ row }) => {
          const variantOpt = row.original.options?.find(
            (opt) => opt.option_id === option.id
          )
          if (!variantOpt) {
            return <PlaceholderCell />
          }
          // const optionValue = row.original?.options?.[0]?.value
          // const filteredPrices = row.original?.prices?.filter((price) => {
          //   return !(
          //     price.amount.toString() === optionValue &&
          //     !price.currency_code ===
          //       row.original?.prices?.find(
          //         (p) => p.amount.toString() === optionValue
          //       )?.currency_code
          //   )
          // })

          const priceList =
            row.original?.prices
              ?.map((price) => `${price.amount} ${price.currency_code}`)
              .join(", ") || "-"

          return (
            <div className="flex items-center">
              <Badge
                size="2xsmall"
                title={variantOpt.value}
                // max-w-[140px]
                className="inline-flex min-w-[20px] 
                items-center justify-center overflow-hidden truncate"
              >
                {priceList}
              </Badge>
            </div>
          )
        },
      })
    })
  }, [product])

  return useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      // columnHelper.accessor("title", {
      //   header: () => (
      //     <div className="flex h-full w-full items-center">
      //       <span className="truncate">{t("fields.title")}</span>
      //     </div>
      //   ),
      //   cell: ({ getValue }) => (
      //     <div className="flex h-full w-full items-center overflow-hidden">
      //       <span className="truncate">{getValue()}</span>
      //     </div>
      //   ),
      // }),

      ...optionColumns,

      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { product } = table.options.meta as {
            product: HttpTypes.AdminProduct
          }

          return <GiftVariantActions variant={row.original} product={product} />
        },
      }),
    ],
    [t, optionColumns]
  )
}
