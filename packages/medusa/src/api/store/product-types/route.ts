import { StoreProductTypeListResponse } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { StoreProductTypesParamsType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreProductTypesParamsType>,
  res: MedusaResponse<StoreProductTypeListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: product_types, metadata } = await query.graph({
    entity: "product_type",
    filters: req.filterableFields,
    pagination: req.queryConfig.pagination,
    fields: req.queryConfig.fields,
  })

  res.json({
    product_types,
    count: metadata?.count ?? 0,
    offset: metadata?.skip ?? 0,
    limit: metadata?.take ?? 0,
  })
}
