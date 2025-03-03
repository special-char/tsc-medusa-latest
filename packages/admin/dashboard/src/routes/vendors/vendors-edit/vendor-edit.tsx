import { Heading } from "@medusajs/ui"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { RouteDrawer } from "../../../components/modals"
import { EditProfileForm } from "./components/edit-vendor-form/edit-vendor-form"
import { useState, useEffect } from "react"
import { sdk } from "../../../lib/client"

export const ProfileEdit = () => {
  const { id } = useParams()

  // State for managing user data, loading, and error states
  const [vendorUser, setVendorUser] = useState<any>(null)
  const [isVendorPending, setIsVendorPending] = useState(true)
  const [isVendorError, setIsVendorError] = useState(false)
  const [vendorError, setVendorError] = useState<any>(null)

  const { t } = useTranslation()

  // Fetch the vendor data when the component mounts or the id changes
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setIsVendorPending(true)
        const fetchedUser = await sdk.vendor.retrieveById(id || "")
        setVendorUser(fetchedUser.user)
      } catch (err) {
        setIsVendorError(true)
        setVendorError(err)
      } finally {
        setIsVendorPending(false)
      }
    }

    if (id) {
      fetchVendorData()
    }
  }, [id])

  // If there was an error during the fetch, throw or handle it
  if (isVendorError) {
    throw vendorError // You can handle it more gracefully if needed
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header className="capitalize">
        <RouteDrawer.Title asChild>
          <Heading>{t("profile.edit.header")}</Heading>
        </RouteDrawer.Title>
      </RouteDrawer.Header>

      {/* Only render the form when the data is not pending */}
      {!isVendorPending && vendorUser && <EditProfileForm user={vendorUser} />}
    </RouteDrawer>
  )
}
