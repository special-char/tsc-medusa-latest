import { Input, Label, clx } from "@medusajs/ui"
import {
  useController,
  UseControllerProps,
  UseFormRegister,
  FieldValues,
} from "react-hook-form"
import { useState, useEffect } from "react"
import { IconButton } from "@medusajs/ui"
import { Trash } from "@medusajs/icons"

type Props = {
  title: string
  className?: string
  register: UseFormRegister<FieldValues>
  watch: any
} & UseControllerProps

const ImagePicker = ({
  control,
  name,
  title,
  rules,
  defaultValue,
  register,
  className,
  watch,
  ...props
}: Props) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  })

  const [previewUrl, setPreviewUrl] = useState(field?.value)

  const handleRemoveImage = () => {
    field.onChange(null)
    setPreviewUrl(null)
  }

  const handleOnChange = (event: any) => {
    field.onChange(event.target.file)
  }

  const currentImage = watch(name)

  useEffect(() => {
    if (currentImage instanceof File) {
      const objectUrl = URL.createObjectURL(currentImage)
      setPreviewUrl(objectUrl)

      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [currentImage])

  return (
    <>
      {previewUrl ? (
        <div>
          <span
            className={
              rules?.required ? "after:text-rose-60 after:content-['*']" : ""
            }
          >
            {title}
          </span>
          <IconButton
            type="button"
            onClick={handleRemoveImage}
            className="text-rose-60"
          >
            <Trash />
            <span className="sr-only">Remove Image</span>
          </IconButton>
        </div>
      ) : (
        <Label
          className={clx("space-y-2 p-1", {
            [`${className}`]: !!className,
          })}
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
            <span
              className={
                rules?.required ? "after:text-rose-60 after:content-['*']" : ""
              }
            >
              {title}
            </span>
          </div>
          {/* {field?.value && <CustomImage src={previewUrl} />} */}
          <Input {...register(name)} type="file" onChange={handleOnChange} />
          {error && <p className="text-small text-rose-600">{error.message}</p>}
        </Label>
      )}
    </>
  )
}

export default ImagePicker
