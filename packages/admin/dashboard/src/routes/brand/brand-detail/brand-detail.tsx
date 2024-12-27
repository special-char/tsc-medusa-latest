import { useLoaderData, useParams } from "react-router-dom"
import { useState, useEffect } from "react"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { BrandGeneralSection } from "./components/brand-general-section"
import { BrandProductSection } from "./components/brand-product-section"
import { BrandLoader } from "./loader"
import { Brand } from "../brand-list/components/brand-list-table"

export const BrandDetail = () => {
  const { id } = useParams()
  const initialData = useLoaderData() as Awaited<ReturnType<typeof BrandLoader>>
  // const { brand, isPending, isError, error } = useBrand(id!, initialData)
  const [brand, setBrand] = useState<Brand | null>(initialData)
  const [isPending, setIsPending] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchBrand = async () => {
      try {
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

        const data: Brand = await response.json()
        setBrand(data)
      } catch (err) {
        setIsError(true)
        setError(err as Error)
      } finally {
        setIsPending(false)
      }
    }

    fetchBrand()
  }, [id])

  const { getWidgets } = useDashboardExtension()

  if (isPending || !brand) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("product_type.details.after"),
        before: getWidgets("product_type.details.before"),
      }}
      showJSON
      showMetadata
      data={brand}
    >
      <BrandGeneralSection Brand={brand} />
      <BrandProductSection Brand={brand} />
    </SingleColumnPage>
  )
}
