import { RouteFocusModal } from "../../../components/modals"
import { useForm } from "react-hook-form"
import AmcRouterModal from "../common/amc-router-modal"

const AmcCreate = () => {
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

export default AmcCreate
