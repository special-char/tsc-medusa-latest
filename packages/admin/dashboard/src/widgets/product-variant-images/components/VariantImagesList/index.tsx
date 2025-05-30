import { useState } from "react"
import { CustomProductVariantType } from "../../types"
import ProductVariantImageListSection from "../ProductVariantImageListSection"
import ProductVariantMediaForm from "../ProductVariantMediaForm"

const VariantImagesList = ({
  variants,
  refetch,
}: {
  variants: CustomProductVariantType[]
  refetch: () => void
}) => {
  const [openedVariant, setOpenedVariant] =
    useState<CustomProductVariantType | null>(null)

  const handleClose = () => {
    setOpenedVariant(null)
    refetch()
  }

  return (
    <>
      <div className="divide-y">
        {variants.map((variant) => (
          <ProductVariantImageListSection
            key={variant.id}
            variant={variant}
            onEdit={() => setOpenedVariant(variant)}
          />
        ))}
      </div>
      {openedVariant && (
        <ProductVariantMediaForm
          variant={openedVariant}
          open={!!openedVariant}
          onClose={handleClose}
          formId="variant-images-form"
        />
      )}
    </>
  )
}

export default VariantImagesList
