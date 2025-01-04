import { LoaderFunctionArgs } from "react-router-dom"

// import { BrandsQueryKeys } from "../../../hooks/api/brands"
import { queryClient } from "../../../lib/query-client"
import { sdk } from "../../../lib/client/client"

const BrandDetailQuery = (id: string) => ({
  queryKey: ["brand", id],
  queryFn: async () => {
  
    const response = await sdk.admin.brand.retrieve(id!)
    // if (!response) {
    //   throw new Error("Network response was not ok")
    // }
    const brand = response
    return brand
  },
})

export const BrandLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = BrandDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}
