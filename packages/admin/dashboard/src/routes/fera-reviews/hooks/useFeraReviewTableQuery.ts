import { useQueryParams } from "../../../hooks/use-query-params"

type UseFeraReviewTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useFeraReviewTableQuery = ({
  prefix,
  pageSize = 20,
}: UseFeraReviewTableQueryProps) => {
  const queryObject = useQueryParams(
    ["offset", "q", "sort_by", "state"],
    prefix
  )

  const { offset, sort_by, state, q } = queryObject

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    sort_by,
    search: q,
    state,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
