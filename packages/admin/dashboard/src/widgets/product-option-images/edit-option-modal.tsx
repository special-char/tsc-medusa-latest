import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { Button } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IconButton } from "@medusajs/ui"
import { XMarkMini } from "@medusajs/icons"
import FileUploadField from "../../components/custom/components/form/FileUploadField"
import { AdminProductOption } from "@medusajs/types"
import { sdk } from "../../lib/client"

interface FormValues {
  color1: string | null
  color2: string | null
  thumbnail: any | null
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
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(
    optionvalue?.metadata?.thumbnail ? optionvalue?.metadata?.thumbnail : null
  )
  const [color1, setColor1] = useState<string | null>(
    optionvalue.metadata?.color1 ?? null
  )
  const [color2, setColor2] = useState<string | null>(
    optionvalue.metadata?.color2 ?? null
  )

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      color1: optionvalue.metadata?.color1 ?? null,
      color2: optionvalue.metadata?.color2 ?? null,
      thumbnail: null,
    },
  })

  useEffect(() => {
    if (optionvalue.metadata) {
      reset({
        color1: optionvalue.metadata.color1 ?? null,
        color2: optionvalue.metadata.color2 ?? null,
        thumbnail: null,
      })
      setColor1(optionvalue.metadata.color1 ?? null)
      setColor2(optionvalue.metadata.color2 ?? null)
    } else {
      reset({
        color1: null,
        color2: null,
        thumbnail: null,
      })
      setColor1(null)
      setColor2(null)
    }
    setThumbnailImage(optionvalue?.metadata?.thumbnail ?? null)
  }, [optionvalue, reset])

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    let thumbnailUrl: string | null = null
    if (thumbnailImage) {
      thumbnailUrl = thumbnailImage
    } else {
      try {
        if (data.thumbnail && data.thumbnail.length > 0) {
          const response = await sdk.admin.upload.create({
            files: data.thumbnail,
          })
          thumbnailUrl = response.files[0].url
          setThumbnailImage(thumbnailUrl)
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
        navigate(0)
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div className="pt-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <h2 className="inter-large-semibold mb-base">
            Upload Thumbnail{" "}
            <span className="inter-small-semibold text-grey-50">
              (stores data in metadata)
            </span>
          </h2>

          <Controller
            name="thumbnail"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <>
                <FileUploadField
                  filetypes={[
                    "image/gif",
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                  ]}
                  {...field}
                />
              </>
            )}
          />
        </div>
        <div>
          <h2 className="inter-large-semibold mb-base">Thumbnail</h2>
          <div className="flex h-32 w-32 items-center justify-center relative border-2 border-grey-20 border-dashed rounded-lg">
            {thumbnailImage ? (
              <>
                <img
                  src={thumbnailImage ?? ""}
                  alt={"Category Uploaded image"}
                  className="rounded-lg max-w-32 max-h-32 object-cover"
                />
                <IconButton
                  type="button"
                  onClick={() => setThumbnailImage(null)}
                  className="absolute top-0 right-0 rounded-full p-1"
                >
                  <XMarkMini />
                </IconButton>
              </>
            ) : (
              <div className="flex items-center justify-center text-center text-grey-50 w-32 h-32">
                No thumbnail found
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 className="inter-large-semibold mb-base">Colors</h2>
          <div className="flex gap-8">
            <div>
              <label className="inter-small-semibold text-grey-50">
                Color 1
              </label>
              <Controller
                name="color1"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 relative ${
                        color1 ? "" : "bg-white border border-black"
                      }`}
                      style={{
                        background: color1
                          ? color1
                          : "linear-gradient(135deg, #fff 0%, #fff 48%, #000 48%, #000 53%,#fff 53%, #fff 100%)",
                      }}
                    >
                      <input
                        type="color"
                        {...field}
                        value={color1 || ""}
                        onChange={(e) => {
                          field.onChange(e.target.value)
                          setColor1(e.target.value)
                        }}
                        className="absolute inset-0 w-full h-full cursor-pointer"
                        style={{ opacity: 0, pointerEvents: "all" }}
                      />
                    </div>
                    {field.value && (
                      <IconButton
                        type="button"
                        onClick={() => {
                          field.onChange(null)
                          setColor1(null)
                        }}
                      >
                        <XMarkMini />
                      </IconButton>
                    )}
                  </div>
                )}
              />
            </div>
            <div>
              <label className="inter-small-semibold text-grey-50">
                Color 2
              </label>
              <Controller
                name="color2"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 relative ${
                        color2 ? "" : "bg-white border border-black"
                      }`}
                      style={{
                        background: color2
                          ? color2
                          : "linear-gradient(135deg, #fff 0%, #fff 48%, #000 48%, #000 53%,#fff 53%, #fff 100%)",
                      }}
                    >
                      <input
                        type="color"
                        {...field}
                        value={color2 || ""}
                        onChange={(e) => {
                          field.onChange(e.target.value)
                          setColor2(e.target.value)
                        }}
                        className="absolute inset-0 w-full h-full cursor-pointer"
                        style={{ opacity: 0, pointerEvents: "all" }}
                      />
                    </div>
                    {field.value && (
                      <IconButton
                        type="button"
                        onClick={() => {
                          field.onChange(null)
                          setColor2(null)
                        }}
                      >
                        <XMarkMini />
                      </IconButton>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-x-3 mt-base">
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
