import { useVendor } from "../../../hooks/api/users"
import { ProfileGeneralSection } from "./components/profile-general-section"
import { useParams } from "react-router-dom"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"

export const ProfileDetail = () => {
  const { id } = useParams()
  const { user, isPending: isLoading, isError, error } = useVendor(id || "")

  const { getWidgets } = useDashboardExtension()

  if (isLoading || !user) {
    return <SingleColumnPageSkeleton sections={1} />
  }

  if (isError) {
    throw error
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
