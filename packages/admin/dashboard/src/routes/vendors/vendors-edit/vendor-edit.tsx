import { Heading } from "@medusajs/ui"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { RouteDrawer } from "../../../components/modals"
import { useVendor } from "../../../hooks/api/users"
import { EditProfileForm } from "./components/edit-vendor-form/edit-vendor-form"

export const ProfileEdit = () => {
  const { id } = useParams()
  const {
    user: vendorUser,
    isPending: isVendorPending,
    isError: isVendorError,
    error: vendorError,
  } = useVendor(id || "")
  console.log("🚀 ~ ProfileEdit ~ vendorUser:", vendorUser)

  const { t } = useTranslation()

  if (isVendorError) {
    throw vendorError
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header className="capitalize">
        <RouteDrawer.Title asChild>
          <Heading>{t("profile.edit.header")}</Heading>
        </RouteDrawer.Title>
      </RouteDrawer.Header>
      {!isVendorPending && <EditProfileForm user={vendorUser} />}
    </RouteDrawer>
  )
}
