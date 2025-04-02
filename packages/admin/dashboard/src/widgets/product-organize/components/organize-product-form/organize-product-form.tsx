import { Spinner } from "@medusajs/icons"
import { useEffect, useState } from "react"
import { Button, clx, FocusModal, Text, toast } from "@medusajs/ui"
import { SortableList } from "../common/sortable-list"
import { useProducts, useUpdateProductsRank } from "../../hooks/useProducts"
import { Thumbnail } from "../../../../components/common/thumbnail"
import { useNavigate } from "react-router-dom"

export type ProductTreeItem = {
  id: string
  title: string
  handle: string
  thumbnail: string
  product_rank: number | null
  entity_ranks: { id: string; rank: number }[]
}

const QUERY = {
  fields: "id,title,handle,thumbnail,*entity_ranks",
  limit: 9999,
}

export const OrganizeProductForm = ({
  category_id,
}: {
  category_id?: string | undefined
}) => {
  const {
    products,
    isPending: isLoading,
    isError,
    refetch,
    error: fetchError,
  } = useProducts(
    {
      ...QUERY,
      category_id,
      order: "handle",
    },
    {}
  )

  const navigate = useNavigate()

  const { mutateAsync, isPending } = useUpdateProductsRank({
    onSuccess: () => {
      refetch()
      toast.success("Product Rank updated")
      navigate("..", { replace: true })
    },
    onError: (error) => {
      refetch()
      toast.error(error?.message || "Error occured while update")
    },
  })

  const [snapshot, setSnapshot] = useState<ProductTreeItem[]>([])

  useEffect(() => {
    if (products && products.length) {
      const rankedProducts = products
        .map((product: any) => ({
          ...product,
          entity_ranks: product?.entity_ranks?.filter(
            (rank: { rank_type: string; rank_type_id: string }) => {
              if (category_id) {
                return (
                  rank?.rank_type === "category" &&
                  rank.rank_type_id === category_id
                )
              } else {
                return rank?.rank_type === "default"
              }
            }
          ),
        }))
        .filter((x) => x.entity_ranks?.length)
        .sort((a, b) => {
          return (
            (a?.entity_ranks?.[0]?.rank ?? 0) -
            (b?.entity_ranks?.[0]?.rank ?? 0)
          )
        })
      const restProducts = products
        .map((product: any, index: number) => ({
          ...product,
          entity_ranks: product?.entity_ranks?.filter(
            (rank: { rank_type: string; rank_type_id: string }) => {
              if (category_id) {
                return (
                  rank?.rank_type === "category" &&
                  rank.rank_type_id === category_id
                )
              } else {
                return rank?.rank_type === "default"
              }
            }
          ),
        }))
        .filter((x) => !x.entity_ranks?.length)

      setSnapshot(
        [...rankedProducts, ...restProducts].map((x, index) => ({
          ...x,
          product_rank: index,
        }))
      )
    }
  }, [category_id, products])

  const loading = isPending || isLoading

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
      ...(category_id ? { rank_type_id: category_id } : {}),
      rank_type: category_id ? "category" : "default",
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
          {isLoading ? (
            <Spinner className="animate-spin" />
          ) : (
            <>
              <Button onClick={handleProductRankUpdate} isLoading={loading}>
                Save
              </Button>
            </>
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
  item: ProductTreeItem
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
          gridTemplateColumns: `20px 28px 1fr auto`,
        }}
      >
        <SortableList.DragHandle />
        <Thumbnail src={item.thumbnail} />
        <Text size="small" leading="compact">
          {item.title} - ({item.handle})
        </Text>
        <Text className="flex gap-2">
          <span>Current Rank:</span>
          <span className="w-4">{item?.product_rank}</span>
        </Text>
      </div>
    </SortableList.Item>
  )
}
