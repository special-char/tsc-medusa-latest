import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { FetchError } from "@medusajs/js-sdk"
import { sdk } from "../../../../../lib/client"
import { CepcodesResponse } from "../../types"

export const useCepcodes = (
  query?: {
    limit?: number
    offset?: number
    q?: string
  },
  options?: Omit<
    UseQueryOptions<CepcodesResponse, FetchError, CepcodesResponse, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () =>
      sdk.admin.zipcode.list({
        ...query,
      }),
    queryKey: ["cepcodes", JSON.stringify(query)],
    ...options,
  })

  return { ...data, ...rest }
}
