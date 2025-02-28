import { useTranslation } from "react-i18next"
import { toast, usePrompt } from "@medusajs/ui"
import { sdk } from "../../../lib/client"
import { ActionMenu } from "../../../components/common/action-menu"
import { Trash } from "@medusajs/icons"
type VendorRowActionsProps = {
  vendor: { id: string }
  setVendorList: any
}
const deleteVendor = async (vendorId: string) => {
  try {
    const response = await sdk.vendor.delete(vendorId)

    const res = response
    return res
  } catch (error) {
    throw error
  }
}

const handleDeleteVendor = async (
  vendorId: string,
  setVendorList?: (vendors: any[]) => void | null
): Promise<void> => {
  try {
    const res = await deleteVendor(vendorId)
    toast.success("Merchant deleted successfully")
    if (setVendorList) {
      setVendorList(res.data)
    }
  } catch (error: any) {
    toast.error(
      error?.message || "Failed to delete Merchant. Please try again."
    )
  }
}
const useDeleteVendorAction = (
  id: string,
  setVendorList?: (vendors: any[]) => void | null
) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const handleDelete = async () => {
    const result = await prompt({
      title: t("general.areYouSure"),
      description: `You are about to delete the merchant. This action is irreversible.`,
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }
    await handleDeleteVendor(id, setVendorList)
  }

  return handleDelete
}

export const VendorRowActions = ({
  vendor,
  setVendorList,
}: VendorRowActionsProps) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteVendorAction(vendor.id, setVendorList)

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.delete"),
              icon: <Trash />,
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}
