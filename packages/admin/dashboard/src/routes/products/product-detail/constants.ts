import { getLinkedFields } from "../../../extensions"

// TODO: TSC update it in new version
// export const PRODUCT_DETAIL_FIELDS = getLinkedFields(
//   "product",
//   "*categories,*shipping_profile,+brand.*,-variants"
// )

export const PRODUCT_DETAIL_FIELDS = getLinkedFields(
  "product",
  "*categories,+brand.*,-variants"
)
