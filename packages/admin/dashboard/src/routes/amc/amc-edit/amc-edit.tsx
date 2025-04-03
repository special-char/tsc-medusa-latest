import { useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { sdk } from "../../../lib/client"
import AmcDetail from "../components/AmcDetail"
import { transformPrices } from "../consts"
import { reverseTransformPrices } from "../consts"
type Props = {}

export const AmcEdit = (props: Props) => {
  const { state } = useLocation()
  const form = useForm({
    defaultValues: {
      title: state.title,
      sku: state.sku,
      barcode: state.barcode,
      prices: reverseTransformPrices(state?.price_set?.prices ?? []),
      duration: state.duration,
      variant_id: state.product_variants.map((v: any) => v.id),
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
    await sdk.client.fetch(`/admin/amc/${state.id}`, {
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
      <AmcDetail form={form} amcId={state.id} onSubmit={onSubmit} />
    </>
  )
}
