import { LoaderFunctionArgs } from "react-router-dom"

import { productsQueryKeys } from "../../../hooks/api/products"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { PRODUCT_DETAIL_FIELDS } from "./constants"

const productDetailQuery = (id: string) => ({
  queryKey: productsQueryKeys.detail(id, { fields: PRODUCT_DETAIL_FIELDS }),
  queryFn: async () => {
    const fields = PRODUCT_DETAIL_FIELDS.includes("brand")
      ? PRODUCT_DETAIL_FIELDS
      : PRODUCT_DETAIL_FIELDS + "+brand.*"
    return sdk.admin.product.retrieve(id, { fields })
  },
})

export const productLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = productDetailQuery(id!)

  const response = await queryClient.ensureQueryData({
    ...query,
    staleTime: 90000,
  })

  return response
}
