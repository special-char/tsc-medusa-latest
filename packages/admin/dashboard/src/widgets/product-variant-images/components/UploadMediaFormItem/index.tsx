import { useCallback } from "react"
import { UseFormReturn, Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Label, Text } from "@medusajs/ui"

// import { MediaSchema } from "../../../product-create/constants";
// import {
// 	EditProductMediaSchemaType,
// 	ProductCreateSchemaType,
// } from "../../../product-create/types";
import { FileType, FileUpload } from "../FileUpload"
import { EditProductMediaSchemaType, MediaSchema } from "../../lib/constants"

type Media = z.infer<typeof MediaSchema>

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/svg+xml",
]

const SUPPORTED_FORMATS_FILE_EXTENSIONS = [
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".heic",
  ".svg",
]

export const UploadMediaFormItem = ({
  form,
  append,
  showHint = true,
}: {
  form: UseFormReturn<EditProductMediaSchemaType>
  append: (value: Media) => void
  showHint?: boolean
}) => {
  const { t } = useTranslation()

  const hasInvalidFiles = useCallback(
    (fileList: FileType[]) => {
      const invalidFile = fileList.find(
        (f) => !SUPPORTED_FORMATS.includes(f.file.type)
      )

      if (invalidFile) {
        form.setError("variant_media", {
          type: "invalid_file",
          message: t("products.media.invalidFileType", {
            name: invalidFile.file.name,
            types: SUPPORTED_FORMATS_FILE_EXTENSIONS.join(", "),
          }),
        })

        return true
      }

      return false
    },
    [form, t]
  )

  const onUploaded = useCallback(
    (files: FileType[]) => {
      form.clearErrors("variant_media")
      if (hasInvalidFiles(files)) {
        return
      }

      files.forEach((f) => {
        console.log({
          ...f,
          isThumbnail: false,
          isSelected: true,
          isPlp: false,
        })

        append({ ...f, isThumbnail: false, isSelected: true, isPlp: false })
      })
    },
    [form, append, hasInvalidFiles]
  )

  return (
    <Controller
      control={form.control}
      name="variant_media"
      render={({ fieldState }) => (
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-2">
              <Label className="txt-compact-small font-sans font-medium">
                {t("products.media.label")}
              </Label>
              <Text className="txt-compact-small text-ui-fg-muted font-sans font-normal">
                (Optional)
              </Text>
            </div>
            {showHint && (
              <Text className="txt-compact-small text-ui-fg-muted font-sans font-normal">
                {t("products.media.editHint")}
              </Text>
            )}
          </div>
          <FileUpload
            label={t("products.media.uploadImagesLabel")}
            hint={t("products.media.uploadImagesHint")}
            hasError={!!fieldState.error}
            formats={SUPPORTED_FORMATS}
            onUploaded={onUploaded}
          />
          {fieldState.error && (
            <span className="form-error">{fieldState.error.message}</span>
          )}
        </div>
      )}
    />
  )
}
