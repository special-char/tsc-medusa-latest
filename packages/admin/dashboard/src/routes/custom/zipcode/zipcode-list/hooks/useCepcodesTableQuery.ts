import { useQueryParams } from "../../../../../hooks/use-query-params"

type UseCepcodesTableQueryProps = {
  prefix?: string
  pageSize?: number
}

export const useCepcodesTableQuery = ({
  prefix,
  pageSize = 20,
}: UseCepcodesTableQueryProps) => {
  const queryObject = useQueryParams(["offset", "q"], prefix)

  const { offset, q } = queryObject

  const searchParams = {
    limit: pageSize,
    offset: offset ? Number(offset) : 0,
    q,
  }

  return {
    searchParams,
    raw: queryObject,
  }
}
