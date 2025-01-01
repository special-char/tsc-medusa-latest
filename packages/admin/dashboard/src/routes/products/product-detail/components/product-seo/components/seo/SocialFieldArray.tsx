import {
  useFieldArray,
  UseControllerProps,
  FieldValues,
  useController,
  UseFormReturn,
} from "react-hook-form"
import { Label, ProgressAccordion, clx, IconButton } from "@medusajs/ui"
import CustomInput from "../form/CustomInput"
import CustomTextarea from "../form/CustomTextarea"
import { PlusMini, Trash, Meta, X } from "@medusajs/icons"
import { Button, Select } from "@medusajs/ui"
import FileUploadField from "../form/FileUploadField"

import { useMemo } from "react"
import "./style.css"
import { SeoDetailsTypes } from "../.."

const SocialNetworkOptions = {
  FACEBOOK: "Facebook",
  TWITTER: "Twitter",
}
type SchemaField = {
  label: string
  fieldType: string
  props?: any
  validation?: Record<string, any>
}

type Props = {
  title: string
  className?: string
  form: UseFormReturn<FieldValues>
  productSeo: SeoDetailsTypes
  fields: Record<string, SchemaField>
} & UseControllerProps

const SocialFieldArray = ({
  ...props
}: // title,
// name,
// control,
// register,
// watch,
// className,
Props) => {
  const {
    fields: metaSocialFields,
    remove,
    append,
    update,
  } = useFieldArray({
    control: props.form.control,
    name: props.name,
  })
  const metaFields = useMemo(
    () =>
      metaSocialFields.map((item, index) => ({
        ...item,
        id: props.productSeo?.metaSocial?.[index]?.id ?? item.id,
      })),
    [metaSocialFields, props.productSeo]
  )

  return (
    <ul
      className={clx("space-y-2", {
        [`${props.className}`]: !!props.className,
      })}
    >
      {metaFields.map((item, index) => {
        if (item.isDeleted) return null
        const defaultValue = item.isNew ? [item.id] : undefined
        return (
          <>
            <ProgressAccordion
              type="multiple"
              defaultValue={[item.id]}
              // value={defaultValue}
              className="p-4 border rounded-md"
            >
              <SocialFieldArrayCard
                key={item.id}
                item={item}
                register={props.form.register}
                index={index}
                remove={remove}
                update={update}
                control={props.form.control}
                watch={props.form.watch}
                {...props}
              />
            </ProgressAccordion>
          </>
        )
      })}
      <Button
        type="button"
        className="w-full flex gap-4 items-center"
        variant="secondary"
        onClick={() => {
          append({
            socialNetwork: "",
            title: "",
            description: "",
            image: null,
            isNew: true,
          })
        }}
      >
        <PlusMini />
        <span>Add Field</span>
      </Button>
    </ul>
  )
}

const formFields = (form: UseFormReturn<FieldValues>) => ({
  socialNetwork: {
    label: "Social Network",
    fieldType: "select",
  },
  title: {
    label: "Social Title",
    fieldType: "input",
  },
  description: {
    label: "Social Description",
    fieldType: "textarea",
  },
  image: {
    label: "Social Image",
    fieldType: "file-upload",
  },
})

const SocialFieldArrayCard = ({
  item,
  remove,
  update,
  index,
  register,
  control,
}) => {
  const { field } = useController({
    name: `metaSocial.${index}.socialNetwork`,
    control: control,
  })
  const fileUploadField = useController({
    name: `metaSocial.${index}.image`,
    control: control,
  })

  return (
    <ProgressAccordion.Item defaultValue={item.id} value={item.id}>
      <div className="flex items-center justify-between relative">
        <ProgressAccordion.Header className="pl-0 pr-5" prefix="">
          <div className="w-full flex items-center justify-between">
            <span>
              {!field.value && "No Network Selected"}
              {field.value === SocialNetworkOptions.FACEBOOK && (
                <Meta className="ml-2" />
              )}
              {field.value === SocialNetworkOptions.TWITTER && (
                <X className="ml-2" />
              )}
            </span>
          </div>
        </ProgressAccordion.Header>
        <IconButton
          type="button"
          variant="transparent"
          className="border  right-0"
          onClick={() =>
            update(index, {
              ...item,
              isDeleted: true,
            })
          }
        >
          <Trash className="text-red-500" />
        </IconButton>
      </div>
      <ProgressAccordion.Content className="pl-0 pr-0">
        {/* <li className="gap-4 flex flex-col border rounded-md p-4"> */}
        <li className="gap-4 grid grid-cols-2 border rounded-md p-4">
          <div>
            <Label className={clx("space-y-2")}>
              <span>Social Network</span>
              <Select
                required
                onValueChange={field.onChange}
                value={field.value}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Select a Network" />
                </Select.Trigger>
                <Select.Content>
                  {Object.keys(SocialNetworkOptions).map((key) => {
                    const Icon =
                      SocialNetworkOptions[
                        key as keyof typeof SocialNetworkOptions
                      ] === "Facebook"
                        ? Meta
                        : X
                    return (
                      <Select.Item
                        className="flex items-center "
                        key={key}
                        value={SocialNetworkOptions[key]}
                      >
                        {/* <Icon className="mr-2" /> */}
                        <span>{SocialNetworkOptions[key]}</span>
                      </Select.Item>
                    )
                  })}
                </Select.Content>
              </Select>
            </Label>
          </div>
          <div>
            <CustomInput
              name={`metaSocial.${index}.title`}
              control={control}
              title={"Social Title"}
              rules={{
                required: "Social Title is required",
                pattern: {
                  value: /^(?!^\d+$)^.+$/,
                  message: "Only numbers are not allowed in the title",
                },
              }}
            />
          </div>
          <div>
            <CustomTextarea
              name={`metaSocial.${index}.description`}
              control={control}
              title={"Social Description"}
              rules={{
                required: "Social Description is required",
                pattern: {
                  value: /^(?!^\d+$)^.+$/,
                  message: "Only numbers are not allowed in the description",
                },
              }}
            />
          </div>
          <div>
            <FileUploadField
              {...register(`metaSocial.${index}.image`)}
              {...fileUploadField.field}
            />
          </div>
        </li>
      </ProgressAccordion.Content>
    </ProgressAccordion.Item>
  )
}

export default SocialFieldArray
