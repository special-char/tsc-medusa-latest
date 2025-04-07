import { useTranslation } from "react-i18next"

import type { Filter } from "../../../components/table/data-table"

export const usePendingOrderTableFilters = (): Filter[] => {
  const { t } = useTranslation()

  const paymentMethods = [
    { label: "Credit Card", value: "pp_pagbank-cc_pagbank" },
    { label: "PIX", value: "pp_pagbank-pix_pagbank" },
    { label: "Boleto", value: "pp_pagbank-boleto_pagbank" },
  ]

  let filters: Filter[] = []

  if (paymentMethods) {
    const regionFilter: Filter = {
      key: "payment_method",
      label: "Payment Methods",
      type: "select",
      options: paymentMethods.map((pm) => ({
        label: pm.label,
        value: pm.value,
      })),
      multiple: true,
      searchable: true,
    }

    filters = [...filters, regionFilter]
  }

  const dateFilters: Filter[] = [
    { label: "Created At", key: "created_at" },
    { label: "Updated At", key: "updated_at" },
  ].map((f) => ({
    key: f.key,
    label: f.label,
    type: "date",
  }))

  filters = [...filters, ...dateFilters]

  return filters
}
