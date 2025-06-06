import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { SectionRow } from "../../../../components/common/section"
import { useDashboardExtension } from "../../../../extensions"

type ProductGeneralSectionProps = {
  product: HttpTypes.AdminProduct
}

export const ProductGeneralSection = ({
  product,
}: ProductGeneralSectionProps) => {
  const { t } = useTranslation()
  const { getDisplays } = useDashboardExtension()

  const displays = getDisplays("product", "general")

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>Product</Heading>
      </div>
      <SectionRow title={t("fields.title")} value={product?.title} />

      <SectionRow title={t("fields.handle")} value={`/${product?.handle}`} />
      {displays.map((Component, index) => {
        return <Component key={index} data={product} />
      })}
    </Container>
  )
}
