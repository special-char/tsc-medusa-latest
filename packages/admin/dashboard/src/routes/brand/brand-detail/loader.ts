import { LoaderFunctionArgs } from "react-router-dom"

// import { BrandsQueryKeys } from "../../../hooks/api/brands"
import { queryClient } from "../../../lib/query-client"

const BrandDetailQuery = (id: string) => ({
  queryKey: ["brand", id],
  queryFn: async () => {
    const response = await fetch(`${__BACKEND_URL__}/admin/brand/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const brand = await response.json()
    return brand
  },
})

export const BrandLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = BrandDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}
