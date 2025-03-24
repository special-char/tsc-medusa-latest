import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import { useForm } from "react-hook-form"
import AmcRouterModal from "../common/amc-router-modal"

const AmcEdit = () => {
  const { id } = useParams()

  const form = useForm()
  const onSubmit = (data: any) => {
    console.log("🚀 ~ onSubmit ~ data:", data)
  }
  return (
    <RouteFocusModal>
      <AmcRouterModal form={form} onSubmit={onSubmit} />
    </RouteFocusModal>
  )
}

export default AmcEdit
