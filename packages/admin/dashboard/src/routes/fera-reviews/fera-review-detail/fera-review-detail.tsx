import { useParams } from "react-router-dom"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { useFeraReview } from "../hooks/useFeraReview"
import { FeraReviewGeneralSection } from "./components/fera-review-general-section"
import { FeraReviewCustomerSection } from "./components/fera-review-customer-section"
import { FeraReviewMediaSection } from "./components/fera-review-media-section"
import ProductDetailWrapper from "./components/product-detail-wrapper"
import { FeraReviewInfoSection } from "./components/fera-review-info-section"

export const FeraReviewDetail = () => {
  const { id } = useParams()

  const { review, isLoading, isError, error } = useFeraReview(id!)

  if (isLoading || !review) {
    return (
      <TwoColumnPageSkeleton mainSections={4} sidebarSections={2} showJSON />
    )
  }

  if (isError) {
    console.error("Error state:", error)
    throw error
  }

  return (
    <>
      <div className="flex w-full flex-col gap-y-3">
        <div className="flex w-full flex-col items-start gap-x-4 gap-y-3 xl:grid xl:grid-cols-[minmax(0,_1fr)_440px]">
          <div className="flex w-full min-w-0 flex-col gap-y-3">
            <FeraReviewInfoSection review={review} />
            {review.external_product_id && (
              <ProductDetailWrapper product_id={review.external_product_id} />
            )}
            <FeraReviewGeneralSection review={review} />
            <FeraReviewMediaSection review={review} />
          </div>
          <div className="flex w-full flex-col gap-y-3 xl:mt-0">
            <FeraReviewCustomerSection review={review} />
          </div>
        </div>
      </div>
    </>
  )
}
