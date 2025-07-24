import { Container, toast } from "@medusajs/ui"
import CreateFreeProductForm from "../components/CreateFreeProductForm"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export function CreateFreeGift({ prev = ".." }: { prev?: string }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

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

  const onSuccess = () => {
    toast.success("Free Gift edited sussesfully!")
    setOpen(false)
    navigate("..")
  }

  const onError = () => {
    toast.error("Failed to Edit Free Gift!")
  }

  return (
    <Container className="divide-y p-0">
      <CreateFreeProductForm
        open={open}
        type={"create"}
        onOpenChange={handleOpenChange}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Container>
  )
}
