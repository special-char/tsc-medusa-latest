import { Heading } from "@medusajs/ui"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { EditBrandForm } from "./components/edit-brand-form"
import { useEffect, useState } from "react"
import { Brand } from "../brand-list/components/brand-list-table/brand-list-table"
import { sdk } from "../../../lib/client/client"

export const BrandEdit = () => {
  const { id } = useParams()
  console.log("🚀 ~ BrandEdit ~ id:", id)

  const [brand, setBrand] = useState<Brand | null>(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await sdk.admin.brand.retrieve(id!)
        // if (!response.ok) {
        //   throw new Error("Network response was not ok")
        // }
        const brandData = response
        setBrand(brandData as Brand)
      } catch (error) {
        setIsError(true)
      }
    }

    fetchBrand()
  }, [id])

  if (isError) {
    throw new Error("Failed to fetch brand")
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{"Edit Brand"}</Heading>
      </RouteDrawer.Header>
      {brand ? <EditBrandForm Brand={brand} /> : <div>Loading...</div>}
    </RouteDrawer>
  )
}
