import { useLoaderData, useParams } from "react-router-dom"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { TwoColumnPage } from "../../../components/layout/pages"
import { useProduct } from "../../../hooks/api/products"
import { ProductAttributeSection } from "./components/product-attribute-section"
import { ProductGeneralSection } from "./components/product-general-section"
import { ProductMediaSection } from "./components/product-media-section"
import { ProductOptionSection } from "./components/product-option-section"
import { ProductOrganizationSection } from "./components/product-organization-section"
import { ProductSalesChannelSection } from "./components/product-sales-channel-section"
import { ProductVariantSection } from "./components/product-variant-section"
import { PRODUCT_DETAIL_FIELDS } from "./constants"
import { productLoader } from "./loader"

import { useDashboardExtension } from "../../../extensions"
import ProductVariantImagesWidget from "../../../widgets/product-variant-images/product-variant-images"
import ProductAdditionalDetailsWidget from "../../../widgets/product-additional-details/product-additional-details"
import ProductSeoWidget from "./components/product-seo"
import dashboardConfig from "../../../../dashboard.config"
import ProductOptionImagesWidget from "../../../widgets/product-option-images/product-option-images"
import { ProductShippingProfileSection } from "./components/product-shipping-profile-section"
import ProductGoogleCategoryWidget from "../../../widgets/product-google-categories/product-google-categories"

export const ProductDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof productLoader>
  >

  const { id } = useParams()
  const { product, isLoading, isError, error } = useProduct(
    id!,
    { fields: PRODUCT_DETAIL_FIELDS },
    {
      initialData: initialData,
    }
  )

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
        <ProductOptionSection product={product} />
        <ProductVariantSection product={product} />
        {dashboardConfig?.featureFlags?.productGoogleCategory && (
          <ProductGoogleCategoryWidget data={product} />
        )}
        {dashboardConfig?.featureFlags?.productVariantImages && (
          <ProductVariantImagesWidget data={product} />
        )}
        {dashboardConfig?.featureFlags?.productOptionImages && (
          <ProductOptionImagesWidget data={product} />
        )}
        {dashboardConfig?.featureFlags?.productAdditionalDetails && (
          <ProductAdditionalDetailsWidget data={product} />
        )}
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <ProductSalesChannelSection product={product} />
        {/* TODO: TSC add this when added in new version */}
        {/* <ProductShippingProfileSection product={product} /> */}
        <ProductOrganizationSection product={product} />
        <ProductAttributeSection product={product} />
        {dashboardConfig?.featureFlags?.productSeo && (
          <ProductSeoWidget product={product} />
        )}
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
