import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import AmcDetail from "../components/AmcDetail"
import { transformPrices } from "../consts"
import { sdk } from "../../../lib/client"

export const AmcCreate = () => {
  const form = useForm({
    defaultValues: {
      title: "",
      sku: "",
      barcode: "",
      variant_id: [],
      duration: null,
    },
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
  })
  const navigate = useNavigate()
  const onSubmit = async (data: any) => {
    const reqData = {
      ...data,
      prices: await transformPrices(data.prices ?? []),
    }
    await sdk.client.fetch("/admin/amc", {
      body: reqData,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    navigate("/amc")
  }
  return (
    <>
      <AmcDetail form={form} onSubmit={onSubmit} />
    </>
  )
}
