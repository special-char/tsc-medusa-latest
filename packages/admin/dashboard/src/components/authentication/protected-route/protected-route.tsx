import { Spinner } from "@medusajs/icons"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useMe, useVendorMe } from "../../../hooks/api/users"
import { SearchProvider } from "../../../providers/search-provider"
import { SidebarProvider } from "../../../providers/sidebar-provider"

export const ProtectedRoute = () => {
  const { user: adminUser, isLoading: isAdminLoading } = useMe()
  const { user: vendorUser, isLoading: isVendorLoading } = useVendorMe()
  const location = useLocation()

  if (isAdminLoading || isVendorLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="text-ui-fg-interactive animate-spin" />
      </div>
    )
  }

  if (!adminUser) {
    if (!vendorUser) {
      return <Navigate to="/login" state={{ from: location }} replace />
    }
  }

  return (
    <SidebarProvider>
      <SearchProvider>
        <Outlet />
      </SearchProvider>
    </SidebarProvider>
  )
}
