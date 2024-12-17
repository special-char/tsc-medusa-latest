import { useParams } from "react-router-dom"
import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { TwoColumnPage } from "../../../components/layout/pages"
import { useProduct } from "../../../hooks/api/products"
import { useDashboardExtension } from "../../../extensions"
import { PRODUCT_DETAIL_FIELDS } from "../../products/product-detail/constants"
import { ProductGeneralSection } from "../../products/product-detail/components/product-general-section"
import { ProductMediaSection } from "../../products/product-detail/components/product-media-section"
import { ProductSalesChannelSection } from "../../products/product-detail/components/product-sales-channel-section"
import { GiftDenominationSection } from "./common/component/GiftDenominationSection"

export const GiftCardDetail = () => {
  const { id } = useParams()
  const { product, isLoading, isError, error } = useProduct(id!, {
    fields: PRODUCT_DETAIL_FIELDS,
  })

  const { getWidgets } = useDashboardExtension()

  const after = getWidgets("product.details.after")
  const before = getWidgets("product.details.before")
  const sideAfter = getWidgets("product.details.side.after")
  const sideBefore = getWidgets("product.details.side.before")

  if (isLoading || !product) {
    return (
      <TwoColumnPageSkeleton
        mainSections={4}
        sidebarSections={3}
        showJSON
        showMetadata
      />
    )
  }

  if (isError) {
    throw error
  }

  return (
    <TwoColumnPage
      widgets={{
        after,
        before,
        sideAfter,
        sideBefore,
      }}
      showJSON
      showMetadata
      data={product}
    >
      <TwoColumnPage.Main>
        <ProductGeneralSection product={product} />
        <ProductMediaSection product={product} />
        <GiftDenominationSection product={product} />
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <ProductSalesChannelSection product={product} />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
