import { PencilSquare, Trash } from "@medusajs/icons"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteBrandAction } from "../../../common/hooks/use-delete-brand-action"
import { Brand } from "../../../brand-list/components/brand-list-table/brand-list-table"
import { useNavigate } from "react-router-dom"

type BrandGeneralSectionProps = {
  Brand: Brand
}

export const BrandGeneralSection = ({ Brand }: BrandGeneralSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const deleteBrandAction = useDeleteBrandAction(
    Brand.id,
    Brand.name,
    () => {},
    () => {
      navigate("/settings/brand")
    }
  )

  const handleDelete = () => {
    deleteBrandAction()
  }

  return (
    <Container className="flex items-center justify-between">
      <Heading>{Brand.name}</Heading>
      <ActionMenu
        groups={[
          {
            actions: [
              {
                label: t("actions.edit"),
                icon: <PencilSquare />,
                to: "edit",
              },
            ],
          },
          {
            actions: [
              {
                label: t("actions.delete"),
                icon: <Trash />,
                onClick: handleDelete,
              },
            ],
          },
        ]}
      />
    </Container>
  )
}
