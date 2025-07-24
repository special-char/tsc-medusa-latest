import { Container, toast } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import CreateFreeProductForm from "../components/CreateFreeProductForm"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { sdk } from "../../../lib/client"

const fetchFreeProduct = async ({ id }: { id: string }) => {
  const res = await sdk.client.fetch(`/admin/free-product/${id}`, {
    credentials: "include",
  })

  return res as any
}

export function EditFreeGift({ prev = ".." }: { prev?: string }) {
  const [open, setOpen] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: [`free-product-${id}`, "free-products"],
    queryFn: async () => {
      if (id)
        return await fetchFreeProduct({
          id,
        })
      return null
    },
  })

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

  console.log({ data })

  return (
    <Container className="divide-y p-0">
      {!isLoading && !isError && data?.free_product && (
        <CreateFreeProductForm
          open={open}
          type={"edit"}
          data={data?.free_product}
          onOpenChange={handleOpenChange}
          onSuccess={onSuccess}
          onError={onError}
        />
      )}
    </Container>
  )
}
