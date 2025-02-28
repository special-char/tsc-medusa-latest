import { useForm } from "react-hook-form"
import DynamicForm from "../../../components/custom/components/form/DynamicForm"

const formSchema = {
  uploads: {
    fieldType: "file-upload",
    props: {
      placeholder: "1200 x 1600 (3:4) recommended, up to 10MB each",
      filetypes: ["image/gif", "image/jpeg", "image/png", "image/webp"],
      preview: false,
      multiple: true,
    },
    validation: {},
  },
}

const UploadImageForm = () => {
  const form = useForm() // Initialize useForm

  const onSubmit = (data: any) => {
    // Handle the image upload logic here
    console.log(data)
  }
  return (
    <div className="space-y-2 py-4">
      <h2 className="h2-core font-sans font-medium">
        Media{" "}
        <span className="txt-compact-small font-sans font-normal">
          (optional)
        </span>
      </h2>
      <p className="txt-compact-small whitespace-pre-line text-pretty font-sans font-normal">
        Add images to your product media.
      </p>
      <DynamicForm
        isPending={form.formState.isSubmitting}
        form={form}
        onSubmit={onSubmit}
        schema={formSchema}
      />
    </div>
  )
}

export default UploadImageForm
