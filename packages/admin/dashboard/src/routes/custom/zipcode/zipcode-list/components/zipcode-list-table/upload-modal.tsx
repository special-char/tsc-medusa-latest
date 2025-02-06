import { Button, FocusModal } from "@medusajs/ui"
import UploadForm from "./UploadForm"

const UploadModal = () => {
  return (
    <FocusModal modal>
      <FocusModal.Trigger asChild>
        <Button variant="transparent" className="border">
          Upload CSV File
        </Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header></FocusModal.Header>
        <FocusModal.Body className="grid h-full w-full place-items-center overflow-y-scroll py-16">
          <UploadForm />
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  )
}

export default UploadModal
