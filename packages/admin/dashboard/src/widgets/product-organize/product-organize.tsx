import { useNavigate, useParams } from "react-router-dom"
import { FocusModal } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { OrganizeProductForm } from "./components/organize-product-form/organize-product-form"

export const ProductOrganize = () => {
  const prev = ".."
  const { id } = useParams()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  /**
   * Open the modal when the component mounts. This
   * ensures that the entry animation is played.
   */
  useEffect(() => {
    setOpen(true)

    return () => {
      setOpen(false)
    }
  }, [])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      document.body.style.pointerEvents = "auto"
      navigate(prev, { replace: true })
      return
    }

    setOpen(open)
  }

  return (
    <>
      <FocusModal open={open} onOpenChange={handleOpenChange}>
        <FocusModal.Content>
          <OrganizeProductForm category_id={id} />
        </FocusModal.Content>
      </FocusModal>
    </>
  )
}
