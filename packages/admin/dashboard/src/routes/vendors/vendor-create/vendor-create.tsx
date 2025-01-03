import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { RouteFocusModal } from "../../../components/modals"
import DynamicForm from "../../../components/custom/components/form/DynamicForm"
import { Heading, Text } from "@medusajs/ui"

const formSchema = {
  title: {
    label: "Name",
    fieldType: "input",
    props: {
      placeholder: "Name",
    },
    validation: {
      required: true,
      message: "Name is required",
    },
  },
  logo: {
    label: "Logo",
    fieldType: "image-upload",
    props: {
      placeholder: "1200 x 1600 (3:4) recommended, up to 10MB each",
      filetypes: ["image/gif", "image/jpeg", "image/png", "image/webp"],
      multiple: false,
    },
    validation: {},
  },
}

export function VendorCreate() {
  const form = useForm()

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {}

  return (
    <RouteFocusModal>
      <RouteFocusModal.Header />
      <RouteFocusModal.Body className="relative w-full py-10 px-8 overflow-y-scroll">
        <div className="flex flex-col pb-6">
          <Heading level="h1" className="font-semibold text-xl">
            Create Vendor
          </Heading>
        </div>
        <FormProvider {...form}>
          <DynamicForm
            form={form as any}
            onSubmit={onSubmit as any}
            schema={formSchema as any}
          />
        </FormProvider>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
