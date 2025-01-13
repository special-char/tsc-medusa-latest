import { useMe, useVendorMe } from "../../../hooks/api/users"
import { ProfileGeneralSection } from "./components/profile-general-section"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"

export const ProfileDetail = () => {
  const { user, isPending: isLoading, isError, error } = useMe()
  const {
    user: vendorUser,
    isPending: isVendorPending,
    isError: isVendorError,
    error: vendorError,
  } = useVendorMe()
  const { getWidgets } = useDashboardExtension()

  if (isLoading || !user || isVendorPending || !vendorUser) {
    return <SingleColumnPageSkeleton sections={1} />
  }

  if (isError) {
    if (isVendorError) {
      throw error
    }
  }

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("profile.details.after"),
        before: getWidgets("profile.details.before"),
      }}
    >
      <ProfileGeneralSection user={user} />
    </SingleColumnPage>
  )
}
