import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"
import { useProduct } from "../../../hooks/api"
import { PRODUCT_DETAIL_FIELDS } from "./constants"
import { getSalesChannelIds } from "../../../const/get-sales-channel"

type ProductDetailBreadcrumbProps = UIMatch<HttpTypes.AdminProductResponse>

export const ProductDetailBreadcrumb = (
  props: ProductDetailBreadcrumbProps
) => {
  const { id } = props.params || {}
  const salesChannelIds = getSalesChannelIds()
  const { product } = useProduct(
    id!,
    {
      fields: PRODUCT_DETAIL_FIELDS,
    },
    {
      initialData: props.data,
      enabled: Boolean(id),
    }
  )
 

  if (
    salesChannelIds.length != 0 &&
    !product?.sales_channels?.some((c) => salesChannelIds.includes(c.id))
  ) {
    return null
  }
  if (!product) {
    return null
  }

  return <span>{product.title}</span>
}
