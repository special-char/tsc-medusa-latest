import { Spinner } from "@medusajs/icons"
import { useEffect, useState } from "react"
import { Button, clx, FocusModal, Text } from "@medusajs/ui"
import { SortableList } from "../common/sortable-list"
import { useProducts, useUpdateProductsRank } from "../../hooks/useProducts"

export type ProductTreeItem = {
  id: string
  title: string
  handle: string
  rank: number | null
}

const QUERY = {
  fields: "id,title,handle,*entity_ranks",
  limit: 9999,
}

export const OrganizeProductForm = ({
  category_id,
}: {
  category_id?: string
}) => {
  const {
    products,
    isPending,
    isError,
    error: fetchError,
  } = useProducts({
    ...QUERY,
    category_id,
    order: "handle",
  })

  const { mutateAsync } = useUpdateProductsRank()

  const [snapshot, setSnapshot] = useState<ProductTreeItem[]>([])

  useEffect(() => {
    if (products && products.length) {
      setSnapshot(
        products
          .map((product: any) => ({
            ...product,
            entity_ranks: product?.entity_ranks?.filter(
              (rank: { rank_type: string; rank_type_id: string }) =>
                rank?.rank_type === "category" ||
                rank.rank_type_id === category_id
            ),
          }))
          .filter((x) => x.entity_ranks?.length)
          .sort((a, b) => {
            return (
              (a?.entity_ranks?.[0]?.rank ?? 0) -
              (b?.entity_ranks?.[0]?.rank ?? 0)
            )
          })
      )
    }
  }, [category_id, products])

  const loading = isPending

  const handleRankChange = (items: any[]) => {
    // Items in the SortableList are memorised, so we need to find the current
    // value to preserve any changes that have been made to `should_create`.
    const update = items.map((item, index) => {
      const product = snapshot?.find((v) => v.id === item.id)

      return {
        id: item.id,
        ...(product || item),
        product_rank: index,
      }
    })

    // products.replace(update)
    setSnapshot(update)
  }

  const handleProductRankUpdate = async () => {
    console.log({ snapshot })
    await mutateAsync({
      rank_type_id: category_id,
      rank_type: "category",
      productRankMap: snapshot,
    })
  }

  if (isError) {
    throw fetchError
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <FocusModal.Header>
        <div className="flex items-center justify-end">
          {loading ? (
            <Spinner className="animate-spin" />
          ) : (
            <Button disabled={loading} onClick={handleProductRankUpdate}>
              Save
            </Button>
          )}
        </div>
      </FocusModal.Header>
      <FocusModal.Body className="bg-ui-bg-subtle flex flex-1 flex-col overflow-y-auto">
        <SortableList
          items={snapshot}
          onChange={handleRankChange}
          renderItem={(item, index) => {
            return (
              <ProductItem count={snapshot.length} index={index} item={item} />
            )
          }}
        />
      </FocusModal.Body>
    </div>
  )
}

const ProductItem = ({
  item,
  index,
  count,
}: {
  item: {
    id: string
    handle: string
  }
  index: number
  count: number
}) => {
  return (
    <SortableList.Item
      id={item.id}
      className={clx("bg-ui-bg-base border-b", {
        "border-b-0": index === count - 1,
      })}
    >
      <div
        className="text-ui-fg-subtle grid w-full items-center gap-3 px-6 py-2.5"
        style={{
          gridTemplateColumns: `20px 28px 1fr`,
        }}
      >
        <SortableList.DragHandle />
        <span></span>
        <Text size="small" leading="compact">
          {item.handle}
        </Text>
      </div>
    </SortableList.Item>
  )
}
