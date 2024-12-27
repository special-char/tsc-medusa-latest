import { PencilSquare, Trash } from "@medusajs/icons"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteBrandAction } from "../../../common/hooks/use-delete-brand-action"
import { Brand } from "./brand-list-table"

type BrandRowActionsProps = {
  brand: Brand
  setBrands: (brands: any[]) => void
}

export const BrandRowActions = ({ brand, setBrands }: BrandRowActionsProps) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteBrandAction(brand.id, brand.name, setBrands)

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              icon: <PencilSquare />,
              to: `/settings/brand/${brand.id}/edit`,
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
  )
}
