import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { Button, Label } from "@medusajs/ui"
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AdminProductOption } from "@medusajs/types"
import { sdk } from "../../lib/client"
import CustomColorField from "../../components/custom/components/form/CustomColorField"
import ImageUpload, {
  UploadedImage,
} from "../../components/custom/components/form/ImageUpload"

interface FormValues {
  color1: string | null
  color2: string | null
  thumbnail: UploadedImage | null
}

type Props = {
  onClose: () => void
  optionvalue: any
  options: AdminProductOption[] | null
}

const EditOptionvalueModal: React.FC<Props> = ({
  onClose,
  optionvalue,
  options,
}) => {
  const navigate = useNavigate()

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      color1: optionvalue.metadata?.color1 ?? null,
      color2: optionvalue.metadata?.color2 ?? null,
      thumbnail: optionvalue.metadata?.thumbnail
        ? { url: optionvalue.metadata?.thumbnail }
        : null,
    },
  })

  useEffect(() => {
    if (optionvalue.metadata) {
      reset({
        color1: optionvalue.metadata?.color1 ?? null,
        color2: optionvalue.metadata?.color2 ?? null,
        thumbnail: optionvalue.metadata?.thumbnail
          ? { url: optionvalue.metadata?.thumbnail }
          : null,
      })
    } else {
      reset({
        color1: null,
        color2: null,
        thumbnail: null,
      })
    }
  }, [optionvalue, reset])

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    let thumbnailUrl: string | undefined = data.thumbnail?.url
    try {
      if (data.thumbnail && data.thumbnail.file) {
        const response = await sdk.admin.upload.create({
          files: [data.thumbnail.file],
        })
        thumbnailUrl = response.files[0].url
      }
    } catch (error) {
      console.log("image upload error", { error })
    } finally {
      reset({
        color1: data.color1,
        color2: data.color2,
        thumbnail: null,
      })
    }

    const optionvaluesId: string[] = []

    options?.forEach((option) => {
      option.values?.forEach((val: any) => {
        if (val.value === optionvalue.value) {
          optionvaluesId.push(val.id)
        }
      })
    })

    for (let i = 0; i < optionvaluesId.length; i++) {
      try {
        const response = await sdk.admin.productOptionValue.createOptionValue(
          optionvaluesId[i],
          {
            metadata: {
              color1: data?.color1,
              color2: data?.color2,
              thumbnail: thumbnailUrl ? thumbnailUrl : null,
            },
          }
        )

        if (!response.ok) {
          throw new Error("Received an error response from the server.")
        }
      } catch (error) {
        console.error(error)
      }
    }

    navigate(0)
  }

  return (
    <div className="pt-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          name="thumbnail"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <>
              <Label className="mb-2 block font-sans font-medium">
                Upload Thumbnail{" "}
                <span className="text-gray-500">(Stores data in metadata)</span>
              </Label>
              <ImageUpload
                onChange={field.onChange}
                value={field.value || null}
                multiple={false}
                key={Math.random()}
              />
            </>
          )}
        />
        <div className="flex gap-8">
          <div>
            <Label className="mb-2 block font-sans font-medium">Color 1</Label>
            <Controller
              name="color1"
              control={control}
              render={({ field }) => (
                <CustomColorField
                  name={field.name}
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <div>
            <Label className="mb-2 block font-sans font-medium">Color 2</Label>
            <Controller
              name="color2"
              control={control}
              render={({ field }) => (
                <CustomColorField
                  name={field.name}
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        <div className="mt-base flex justify-end gap-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="px-2.5 py-1"
          >
            Cancel
          </Button>
          <Button type="submit" className="px-2.5 py-1">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditOptionvalueModal
