import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  Button,
  Container,
  Heading,
  StatusBadge,
  usePrompt,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { SectionRow } from "../../../../../components/common/section"
import { useDashboardExtension } from "../../../../../extensions"
import { useDeleteProduct } from "../../../../../hooks/api/products"
import { MEDUSA_STOREFRONT_URL } from "../../../../../lib/storefront"

const productStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "grey"
    case "proposed":
      return "orange"
    case "published":
      return "green"
    case "rejected":
      return "red"
    default:
      return "grey"
  }
}

type ProductGeneralSectionProps = {
  product: HttpTypes.AdminProduct
}

export const ProductGeneralSection = ({
  product,
}: ProductGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const { getDisplays } = useDashboardExtension()

  const displays = getDisplays("product", "general")

  const { mutateAsync } = useDeleteProduct(product.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("products.deleteWarning", {
        title: product.title,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("..")
      },
    })
  }

  const productHandle = product?.metadata?.handlePrefix
    ? `/${product?.metadata?.handlePrefix + " "}/ ${product.handle}`
    : `/${product.handle}`

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{product.title}</Heading>
        <div className="flex items-center gap-x-4">
          <Link
            to={`${MEDUSA_STOREFRONT_URL}/products/${product.handle}?preview=true`}
            target="_blank"
          >
            <Button variant="secondary" size="small">
              Preview
            </Button>
          </Link>
          <StatusBadge color={productStatusColor(product.status)}>
            {t(`products.productStatus.${product.status}`)}
          </StatusBadge>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.edit"),
                    to: "edit",
                    icon: <PencilSquare />,
                  },
                ],
              },
              {
                actions: [
                  {
                    label: t("actions.delete"),
                    onClick: handleDelete,
                    icon: <Trash />,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
      <SectionRow
        title={t("fields.description")}
        value={product.description}
        variant="custom"
      />
      <SectionRow title={t("fields.subtitle")} value={product.subtitle} />
      <SectionRow title={t("fields.handle")} value={`/${product.handle}`} />
      <SectionRow
        title={"Custom Route"}
        value={productHandle}
        // value={`${product?.metadata?.handlePrefix && product?.metadata?.handlePrefix + " "}/ ${product.handle}`}
      />
      <SectionRow
        title={t("fields.discountable")}
        value={product.discountable ? t("fields.true") : t("fields.false")}
      />
      {displays.map((Component, index) => {
        return <Component key={index} data={product} />
      })}
    </Container>
  )
}
