import { createElement, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button, FocusModal } from "@medusajs/ui"

import axios from "axios"
import { CustomProduct, CustomProductVariant } from "../../../types/custom"
import getInputElement from "../../../components/custom/components/form/getInputElement"
import { backendUrl } from "../../../lib/client"

type Props = {
  product: CustomProduct
  variant: CustomProductVariant
  open: boolean
  onClose: () => void
  type: "thumbnail" | "media"
}

type FormValues = {
  selectedImages: string[]
  uploads: File[] | []
}

const VariantsImagesModal = ({
  variant,
  open,
  onClose,
  product,
  type,
}: Props) => {
  const [isUpdating, setIsUpdating] = useState(false)

  const getDefaultSelectedImages = () => {
    return type === "thumbnail"
      ? [variant?.variant_images?.thumbnail]
      : variant?.variant_images?.images || []
  }

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      selectedImages: getDefaultSelectedImages(),
      uploads: [],
    },
  })

  const onSubmit = async (data: FormValues) => {
    let selectedImages = data?.selectedImages
    try {
      console.log("updating variant", variant?.title, variant?.id)

      setIsUpdating(true)
      if (data?.uploads && data?.uploads?.length > 0) {
        console.log("uploads", data?.uploads)

        const formdata = new FormData()
        data?.uploads.forEach((item) => {
          return formdata.append("files", item, item?.name)
        })

        const response = await axios.post(
          `${backendUrl}/admin/uploads`,
          formdata,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        )
        console.log(response.data.files, "files")

        if (response.data.files && response.data.files?.length > 0) {
          const images = [
            ...(product?.images
              ? product?.images?.map((img) => ({ url: img.url }))
              : []),
            ...response.data.files.map((item: any) => ({ url: item?.url })),
          ]

          console.log("payload", images)

          const productResponse = await axios.post(
            `${backendUrl}/admin/products/${product?.id}`,
            {
              images,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          )
          console.log(productResponse.data, "product")
          selectedImages = [
            ...response.data.files?.map((item: any) => item.url),
            ...data?.selectedImages,
          ]
        }
      }
      console.log("Submitted Data:", data)

      const raw = JSON.stringify({
        ...(type === "thumbnail" ? { thumbnail: selectedImages[0] } : {}),
        ...(type === "media" ? { images: selectedImages } : {}),
      })

      console.log({
        body: {
          ...(type === "thumbnail"
            ? { thumbnail: data?.selectedImages[0] }
            : {}),
          ...(type === "media" ? { images: data?.selectedImages } : {}),
        },
      })

      const res = await fetch(
        `${backendUrl}/admin/product-variant-images/product-variant/${variant?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: raw,
        }
      )

      console.log({ res })

      if (!res.ok) {
        throw new Error("Something went wrong")
      }
      const jsonData = await res.json()

      console.log(jsonData)

      onClose()
    } catch (error: any) {
      console.log({ error, message: error?.message })
    } finally {
      setIsUpdating(false)
    }
  }

  // const selectedImages = watch("selectedImages");

  return (
    <FocusModal open={open} onOpenChange={onClose} modal>
      <FocusModal.Content>
        <FocusModal.Header>
          <FocusModal.Title>
            Select {type} for {variant?.title}
          </FocusModal.Title>
          <Button
            variant="primary"
            type="submit"
            disabled={!isDirty}
            isLoading={isUpdating}
            form="variant-images-form"
          >
            Save and close
          </Button>
        </FocusModal.Header>
        <FocusModal.Body className="overflow-y-scroll h-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            id="variant-images-form"
            className="relative grid md:grid-cols-[1fr_40%] md:h-full"
          >
            <div className="p-4 overflow-y-scroll h-full md:border-r">
              <div className="space-y-2 py-4">
                <h2 className="font-sans h2-core font-medium">Uploads</h2>
                <p className="font-normal font-sans txt-compact-small whitespace-pre-line text-pretty">
                  Select an image to use as variant {type} - {variant?.title}.
                </p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] gap-4 py-2">
                {product?.images?.map((image) => (
                  <div
                    key={image.id}
                    className="shadow-elevation-card-rest hover:shadow-elevation-card-hover 
                            transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-[8px]"
                  >
                    <Controller
                      control={control}
                      name="selectedImages"
                      render={({ field }) => (
                        <label className="relative cursor-pointer">
                          <input
                            type="checkbox"
                            className="absolute top-2 right-2"
                            value={image.url}
                            checked={field.value.includes(image.url)}
                            onChange={(e) => {
                              const isChecked = e.target.checked
                              let updatedValues
                              if (type === "thumbnail") {
                                // Only one image allowed for "thumbnail"
                                updatedValues = isChecked ? [image.url] : []
                              } else {
                                // Multiple images allowed for "media"
                                updatedValues = isChecked
                                  ? [...field.value, image.url]
                                  : field.value.filter(
                                      (url) => url !== image.url
                                    )
                              }
                              field.onChange(updatedValues)
                            }}
                          />
                          <img
                            src={image?.url}
                            alt={`image-${image?.id}`}
                            className="size-full object-cover"
                          />
                        </label>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 overflow-y-auto h-fit md:sticky top-0 left-0">
              <div className="space-y-2 py-4">
                <h2 className="font-sans h2-core font-medium">
                  Media{" "}
                  <span className="font-normal font-sans txt-compact-small">
                    (optional)
                  </span>
                </h2>
                <p className="font-normal font-sans txt-compact-small whitespace-pre-line text-pretty">
                  Add images to your product media.
                </p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] gap-4 py-2">
                {watch("uploads").map((file, index) => (
                  <div
                    key={index}
                    className="shadow-elevation-card-rest hover:shadow-elevation-card-hover 
                            transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-[8px]"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`image-${index}`}
                      className="size-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <Controller
                control={control}
                name="uploads"
                render={({ field }) => (
                  <div>
                    <label htmlFor="uploads">
                      {createElement(getInputElement("file-upload"), {
                        placeholder:
                          "1200 x 1600 (3:4) recommended, up to 10MB each",
                        filetypes: [
                          "image/gif",
                          "image/jpeg",
                          "image/png",
                          "image/webp",
                        ],
                        preview: false,
                        multiple: type !== "thumbnail",
                        ...field,
                      })}
                    </label>
                  </div>
                )}
              />
            </div>
          </form>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  )
}

export default VariantsImagesModal
