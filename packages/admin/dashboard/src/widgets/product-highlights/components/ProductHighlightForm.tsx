import { Controller, FieldValues, useForm } from "react-hook-form"
import { AdminProduct } from "@medusajs/framework/types"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../../lib/client"
import { Button, Checkbox, Label, toast } from "@medusajs/ui"
import PDFUploadField from "../../../components/custom/components/form/PdfUploadField"
import { Spinner } from "@medusajs/icons"

const ProductHighlightForm = ({ product }: { product: AdminProduct }) => {
  const navigate = useNavigate()

  const form = useForm<FieldValues>({
    defaultValues: {
      featured: product?.metadata?.featured
        ? product?.metadata?.featured
        : false,
      popular: product?.metadata?.popular ? product?.metadata?.popular : false,
      brochure: product?.metadata?.brochure ? product?.metadata?.brochure : "",
    },
  })

  // const resetFormData = () => {
  //   form.reset({
  //     featured: product?.metadata?.featured ?? false,
  //     popular: product?.metadata?.popular ?? false,
  //     brochure: product?.metadata?.brochure ?? "",
  //   })
  // }

  const onSubmit = async (formFields: FieldValues) => {
    console.log("formFields", formFields)

    try {
      if (product?.id) {
        const response = await sdk.admin.product.update(product.id, {
          metadata: {
            ...product.metadata,
            featured: formFields.featured,
            popular: formFields.popular,
            brochure: formFields.brochure,
          },
        })
        toast("Product highlights updated")
        navigate(0)
        return
      }

      toast("product id not found")
    } catch (error) {
      // notify.error("Error", error);
      console.error("error occured while updating highlights", { error })
    }
  }

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Label>Featured</Label>
            <Controller
              name="featured"
              control={form.control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <Label>Popular</Label>
            <Controller
              name="popular"
              control={form.control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Upload Brochure</Label>
          <Controller
            name="brochure"
            control={form.control}
            render={({ field }) => (
              <PDFUploadField
                filetypes={["application/pdf"]}
                initialPreview={form.watch("brochure")}
                onFileUpload={(fileUrl) => field.onChange(fileUrl)}
                onRemove={() => field.onChange("")}
              />
            )}
          />
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Spinner className="animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
          {/* <Button
            type="button"
            variant="secondary"
            disabled={form.formState.isSubmitting}
            onClick={resetFormData}
          >
            Reset
          </Button> */}
        </div>
      </form>
    </>
  )
}

export default ProductHighlightForm
