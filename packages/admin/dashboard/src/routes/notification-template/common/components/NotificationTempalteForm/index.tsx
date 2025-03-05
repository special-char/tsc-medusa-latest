import {
  Controller,
  FieldValues,
  Form,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form"
import { Button, Input, Label, Text, Textarea } from "@medusajs/ui"
import { Event } from "../../../notification-template-list/components/notification-template-list-table"
import EventSelect from "../SelectEvent"

type Props = {
  onSubmit: SubmitHandler<FieldValues>
  formMethods: UseFormReturn<FieldValues, any, undefined>
  formFields: {
    name: string
    label: string
    type: string
    required: boolean
    props?: Record<string, any>
  }[]
  eventList?: Event[]
}

const NotificationTemplateForm = ({
  formMethods,
  onSubmit,
  formFields,
  eventList,
}: Props) => {
  return (
    <Form
      className="flex flex-[2]"
      control={formMethods.control}
      onSubmit={formMethods.handleSubmit(onSubmit)}
    >
      <div className="flex flex-1 flex-col space-y-4">
        {formFields.map((formField) => {
          return (
            <div key={formField.name}>
              <Controller
                name={formField.name}
                control={formMethods.control}
                rules={{ required: `${formField.label} is required` }}
                render={({ field }) => {
                  const Component =
                    formField.type === "Textarea" ? Textarea : Input
                  return (
                    <>
                      <Label>{formField.label}</Label>
                      {formField.type === "select" ? (
                        <EventSelect
                          field={field}
                          formField={formField}
                          eventList={eventList}
                        />
                      ) : (
                        <Component
                          {...formField?.props}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    </>
                  )
                }}
              />
              {formMethods.formState.errors[formField.name] && (
                <Text className="text-red-500">
                  {
                    formMethods.formState.errors[formField.name]
                      ?.message as string
                  }
                </Text>
              )}
            </div>
          )
        })}
        <Button type="submit" disabled={formMethods.formState.isSubmitting}>
          {formMethods.formState.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </Form>
  )
}

export default NotificationTemplateForm
