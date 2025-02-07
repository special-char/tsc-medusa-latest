import React, { useCallback, useState } from "react"
import { ArrowUpCircleSolid, XMark } from "@medusajs/icons"

export interface UploadedImage {
  id: string
  url: string
  file: File // Added for consistency if needed later
}

interface ImageUploadProps {
  onChange: (images: UploadedImage[] | UploadedImage | null) => void
  value: UploadedImage[] | UploadedImage | null
  multiple?: boolean
}

const ImageComponent = ({
  image,
  removeImage,
}: {
  image: UploadedImage
  removeImage: (id: string) => void
}) => {
  return (
    <div
      key={image.id}
      className="shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full cursor-pointer overflow-hidden rounded-[8px]"
    >
      <img
        src={typeof image === "string" ? image : image.url}
        alt="thumbnail"
        className="size-full object-cover"
      />
      <button
        onClick={() => removeImage(image.id)}
        type="button"
        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
      >
        <XMark />
      </button>
    </div>
  )
}

const RenderImages = ({
  multiple,
  value,
  removeImage,
}: {
  multiple: boolean
  value: UploadedImage | UploadedImage[] | null
  removeImage: (id: string) => void
}) => {
  if (multiple && Array.isArray(value)) {
    return value.map((image) => (
      <ImageComponent image={image} removeImage={removeImage} key={image.id} />
    ))
  } else if (value && !Array.isArray(value)) {
    return <ImageComponent image={value} removeImage={removeImage} />
  }
  return null
}

const ImageUpload = ({
  onChange,
  value,
  multiple = true,
}: ImageUploadProps) => {
  const [inputKey, setInputKey] = useState<number>(0)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files)
      handleChange(files)
    },
    [onChange, value, multiple]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      handleChange(files)
    },
    [onChange, value, multiple]
  )

  const handleChange = useCallback(
    (files: File[]) => {
      const newImages = files.map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        url: URL.createObjectURL(file),
      }))
      if (multiple) {
        if (newImages?.length) {
          const existingImages = Array.isArray(value)
            ? value
            : value
              ? [value]
              : []
          onChange([...existingImages, ...newImages])
        }
      } else {
        if (newImages[0]) {
          onChange(newImages[0])
        }
      }
      setInputKey((prevKey) => prevKey + 1)
    },
    [onChange, value, multiple]
  )

  const removeImage = useCallback(
    (id: string) => {
      if (multiple && Array.isArray(value)) {
        const updatedImages = value.filter((img) => img.id !== id)
        onChange(updatedImages)
      } else {
        onChange(null) // For single image, reset to null
      }
    },
    [onChange, value, multiple]
  )

  return (
    <div>
      {!multiple && value ? (
        <></>
      ) : (
        <label
          className="bg-ui-bg-component border-ui-border-strong transition-fg hover:border-ui-border-interactive focus:border-ui-border-interactive focus:shadow-borders-focus group flex h-full w-full cursor-pointer items-center justify-center gap-y-2 rounded-lg border border-dashed p-8 outline-none focus:border-solid"
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onDrop={handleDrop}
        >
          <span className="flex flex-col items-center justify-center gap-2">
            <span className="text-ui-contrast-fg-primary bg-ui-button-inverted flex cursor-pointer items-center gap-2 rounded-full px-4 py-2">
              <ArrowUpCircleSolid />
              <span>Upload</span>
              <input
                key={inputKey}
                type="file"
                id="multiple-upload"
                className="hidden"
                onChange={handleFileChange}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple={multiple}
              />
            </span>
            <p className="text-center text-gray-600">
              Choose images or drag & drop them here.
              <br />
              JPG, JPEG, PNG, and WEBP. Max 20 MB.
            </p>
          </span>
        </label>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] gap-4 py-2">
        <RenderImages
          multiple={multiple}
          removeImage={removeImage}
          value={value}
        />
      </div>
    </div>
  )
}

export default ImageUpload
