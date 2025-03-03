import { useState, useEffect } from "react"
import { ProfileGeneralSection } from "./components/profile-general-section"
import { useParams } from "react-router-dom"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { sdk } from "../../../lib/client"

export const ProfileDetail = () => {
  const { id } = useParams()

  // State to hold the user data, loading state, and error state
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<any>(null)

  const { getWidgets } = useDashboardExtension()

  // Direct API call to retrieve vendor by id
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const fetchedUser = await sdk.vendor.retrieveById(id || "")
        setUser(fetchedUser.user)
      } catch (err) {
        setIsError(true)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchUserData()
    }
  }, [id])

  // If still loading or user data is not available
  if (isLoading || !user) {
    return <SingleColumnPageSkeleton sections={1} />
  }

  // If there was an error during the fetch
  if (isError) {
    throw error // You can handle it differently, like displaying a user-friendly message
  }

  // Render the profile page once data is loaded
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
