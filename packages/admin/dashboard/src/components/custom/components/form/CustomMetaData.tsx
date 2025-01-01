import React, { useEffect, useState } from "react"
import { Button, IconButton } from "@medusajs/ui"
import { Plus, Trash } from "@medusajs/icons"
import { useTranslation } from "react-i18next"
import InputField from "./InputField"

type AddMetadataProps = {
  value: MetadataField[]
  onChange: (metadata: MetadataField[]) => void
  heading?: string
}

export type MetadataField = {
  key: string
  value: string
}

const CustomMetaData: React.FC<AddMetadataProps> = ({
  value: metadata,
  onChange: setMetadata,
  heading = "Metadata",
}) => {
  const { t } = useTranslation()
  const [localData, setLocalData] = useState<MetadataField[]>(metadata)

  useEffect(() => {
    setLocalData(metadata)
  }, [metadata])

  const addKeyPair = () => {
    const newMetadata = [...metadata, { key: ``, value: `` }]
    setMetadata(newMetadata)
  }

  const onKeyChange = (index: number) => {
    return (key: string) => {
      const newFields = [...metadata]
      newFields[index] = { key: key, value: newFields[index].value }
      setMetadata(newFields)
    }
  }

  const onValueChange = (index: number) => {
    return (value: string) => {
      const newFields = [...metadata]
      newFields[index] = {
        key: newFields[index].key,
        value: value,
      }
      setMetadata(newFields)
    }
  }

  const deleteKeyPair = (index: number) => {
    return () => {
      const newMetadata = metadata.filter((_, i) => i !== index)
      setMetadata(newMetadata)
    }
  }

  return (
    <div>
      <div className="mt-base gap-y-base flex flex-col gap-2">
        {localData.map((field, index) => {
          return (
            <DeletableElement key={index} onDelete={deleteKeyPair(index)}>
              <Field
                field={field}
                updateKey={onKeyChange(index)}
                updateValue={onValueChange(index)}
              />
            </DeletableElement>
          )
        })}
        <div>
          <Button
            variant="secondary"
            size="small"
            type="button"
            className="w-full"
            onClick={addKeyPair}
          >
            <Plus />
            {t("metadata-add-metadata", "Add Metadata")}
          </Button>
        </div>
      </div>
    </div>
  )
}

type FieldProps = {
  field: MetadataField
  updateKey: (key: string) => void
  updateValue: (value: string) => void
}

const Field: React.FC<FieldProps> = ({ field, updateKey, updateValue }) => {
  return (
    <div className="gap-x-xsmall flex w-full items-center gap-2">
      <div className="maw-w-[300px]">
        <InputField
          label="Key"
          placeholder="Key"
          defaultValue={field.key}
          onChange={(e) => {
            updateKey(e.currentTarget.value)
          }}
        />
      </div>
      <div className="flex-grow">
        <InputField
          label="Value"
          placeholder="Value"
          defaultValue={field.value}
          onChange={(e) => {
            updateValue(e.currentTarget.value)
          }}
        />
      </div>
    </div>
  )
}

type DeletableElementProps = {
  onDelete: () => void
  children?: React.ReactNode
}

const DeletableElement: React.FC<DeletableElementProps> = ({
  onDelete,
  children,
}) => {
  return (
    <div className="gap-x-xlarge flex items-end gap-2">
      <div className="flex-grow">{children}</div>
      <IconButton
        size="small"
        className="text-grey-40 h-10 w-10"
        type="button"
        onClick={onDelete}
      >
        <Trash />
      </IconButton>
    </div>
  )
}

export default CustomMetaData
