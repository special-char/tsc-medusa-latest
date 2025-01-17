import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { RouteDrawer } from "../../../components/modals"
import { useMe, useVendorMe } from "../../../hooks/api/users"
import { EditProfileForm } from "./components/edit-profile-form/edit-profile-form"

export const ProfileEdit = () => {
  const { user, isPending: isLoading, isError, error } = useMe()
  const {
    user: vendorUser,
    isPending: isVendorPending,
    isError: isVendorError,
    error: vendorError,
  } = useVendorMe()

  const { t } = useTranslation()

  if (isError) {
    if (isVendorError) {
      throw vendorError
    }
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header className="capitalize">
        <RouteDrawer.Title asChild>
          <Heading>{t("profile.edit.header")}</Heading>
        </RouteDrawer.Title>
      </RouteDrawer.Header>
      {!isLoading && user ? (
        <EditProfileForm user={user} />
      ) : !isVendorPending && vendorUser ? (
        <EditProfileForm user={vendorUser} />
      ) : null}
    </RouteDrawer>
  )
}
