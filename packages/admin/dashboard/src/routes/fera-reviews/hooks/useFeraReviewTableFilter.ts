import type { Filter } from "../../../components/table/data-table"

export const useFeraReviewTableFilter = (): Filter[] => {
  const reviewStatus = [
    { label: "Approved", value: "approved" },
    { label: "Pending", value: "pending_update" },
    { label: "Declined", value: "declined_approval" },
  ]

  let filters: Filter[] = []

  if (reviewStatus) {
    const stateFilter: Filter = {
      key: "state",
      label: "Status",
      type: "select",
      options: reviewStatus.map((rs) => ({
        label: rs.label,
        value: rs.value,
      })),
      multiple: true,
      searchable: true,
    }

    filters = [...filters, stateFilter]
  }

  // const dateFilters: Filter[] = [
  //   { label: "Created At", key: "created_at" },
  //   { label: "Updated At", key: "updated_at" },
  // ].map((f) => ({
  //   key: f.key,
  //   label: f.label,
  //   type: "date",
  // }))

  // filters = [...filters, ...dateFilters]
  filters = [...filters]

  return filters
}
