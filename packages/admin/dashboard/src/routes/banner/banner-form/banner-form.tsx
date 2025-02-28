import { Button, toast, Toaster } from "@medusajs/ui"
import { RouteFocusModal } from "../../../components/modals"
import { FieldValues, useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { SchemaField } from "../../../components/custom/components/form/DynamicForm"
import GenerateFormFields from "../../../components/custom/components/form/DynamicForm/GenerateFormFields"
import { bannerSchema } from "../bannerSchema"
import { BannerProps } from "../banner-list/components/banner-list-table"

interface BannerFormProps {
  initialData?: FieldValues
  // onSubmit: (data: FieldValues) => Promise<void>
  onSubmit: (data: FieldValues) => Promise<BannerProps | undefined>
  isEditMode: boolean
}

export const BannerForm = ({
  initialData,
  onSubmit,
  isEditMode,
}: BannerFormProps) => {
  const [schema, setSchema] = useState<Record<string, SchemaField>>({})

  const form = useForm<FieldValues>({
    defaultValues:
      isEditMode && initialData
        ? {
            name: initialData?.name,
            link: initialData?.link,
            image: initialData?.image,
            text: initialData?.text,
          }
        : {
            name: "",
            link: "",
            image: "",
            text: "",
          },
  })

  useEffect(() => {
    const loadSchema = async () => {
      try {
        const schemaData = await bannerSchema()
        setSchema(schemaData)
      } catch (error) {
        console.error("Error loading schema:", error)
        toast.error("Failed to load schema")
      }
    }
    loadSchema()
  }, [initialData])

  return (
    <RouteFocusModal>
      <Toaster />
      <RouteFocusModal.Header />
      <RouteFocusModal.Body className="overflow-auto">
        <div className="w-full p-5">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-y-3"
          >
            <GenerateFormFields form={form} schema={schema} />

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
