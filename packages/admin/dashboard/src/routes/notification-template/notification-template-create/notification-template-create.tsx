import { RouteFocusModal } from "../../../components/modals"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { Text } from "@medusajs/ui"
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../../lib/client"
import { Event } from "../notification-template-list/components/notification-template-list-table"
import TagList from "../common/components/TagList"
import NotificationTemplateForm from "../common/components/NotificationTempalteForm"

const formFields = [
  {
    name: "event_id",
    label: "Event",
    type: "select",
    required: true,
  },
  {
    name: "subject",
    label: "Subject",
    type: "Input",
    required: true,
    props: {
      placeholder: "Congratulations on your purchase",
    },
  },
  {
    name: "template",
    label: "Template (HTML format)",
    type: "Textarea",
    required: true,
    props: {
      id: "contentTextarea",
      placeholder: "<html>...</html>",
      className: "min-h-52",
    },
  },
]

const fetchEvents = async (setEvent: Dispatch<SetStateAction<Event[]>>) => {
  try {
    const eventData = await sdk.admin.notificationTemplate.listEvent()
    setEvent(eventData.data)
    // return eventData
  } catch (error) {
    console.log(error)
  }
}
const createGiftTemplates = async (data: any) => {
  try {
    const res = await sdk.admin.notificationTemplate.create(data)
    return res
  } catch (error) {
    console.log(error)
  }
}

export const NotificationTemplateCreate = () => {
  const navigate = useNavigate()
  const [eventList, setEventList] = useState<Event[]>([])
  const [tags, setTags] = useState<Event["tags"]>({})

  useEffect(() => {
    fetchEvents(setEventList)
    return () => {}
  }, [])

  const formMethods = useForm<FieldValues>({
    defaultValues: useMemo(() => {
      return {
        event_id: "",
        template: "",
        subject: "",
      }
    }, []),
    mode: "onBlur",
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await createGiftTemplates(data)
      navigate("/settings/notification-template")
      navigate(0)
    } catch (error) {
      console.log("onSubmit error", error)
    }
  }
  const insertTag = (tag: string) => {
    const textarea = document.getElementById(
      "contentTextarea"
    ) as HTMLTextAreaElement

    if (!textarea) {
      return
    }

    const start = textarea.selectionStart

    const end = textarea.selectionEnd

    const currentValue = formMethods.getValues("template")

    const newValue =
      currentValue.substring(0, start) +
      `{{${tag}}}` +
      currentValue.substring(end)

    formMethods.setValue("template", newValue)

    // Move cursor after inserted tag

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd =
        start + `{{${tag}}}`.length

      textarea.focus()
    }, 0)
  }
  return (
    <RouteFocusModal>
      <RouteFocusModal.Header />
      <RouteFocusModal.Body className="relative flex w-full overflow-y-scroll px-8 py-16">
        <NotificationTemplateForm
          setTags={setTags}
          formFields={formFields}
          onSubmit={onSubmit}
          eventList={eventList}
          formMethods={formMethods}
        />
        {/* <Form
          className="flex flex-[2]"
          control={control}
          onSubmit={formMethods.handleSubmit(onSubmit)}
        >
          <div className="flex flex-1 flex-col space-y-4">
            {formFields.map((formField) => {
              return (
                <div key={formField.name}>
                  <Controller
                    name={formField.name}
                    control={control}
                    rules={{ required: `${formField.label} is required` }}
                    render={({ field }) => {
                      return (
                        <>
                          <Label>{formField.label}</Label>
                          {formField.type === "select" ? (
                            <Select
                              onValueChange={(v) => {
                                field.onChange(v)
                                setTags(
                                  eventList?.find((item) => item?.id === v)
                                    ?.tags
                                )
                              }}
                            >
                              <Select.Trigger>
                                <Select.Value
                                  placeholder={`Select an ${field.label}`}
                                />
                              </Select.Trigger>
                              <Select.Content>
                                {eventList.map((item) => (
                                  <Select.Item key={item.id} value={item?.id}>
                                    {item.eventName}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select>
                          ) : (
                            <Textarea
                              id="contentTextarea"
                              className="min-h-52"
                              placeholder="<html>...</html>"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        </>
                      )
                    }}
                  />
                  {errors[formField.name] && (
                    <Text className="text-red-500">
                      {errors[formField.name]?.message as string}
                    </Text>
                  )}
                </div>
              )
            })}
            <Button type="submit" disabled={formMethods.formState.isSubmitting}>
              {formMethods.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </Form> */}
        <div className="flex flex-1 flex-col p-4">
          <Text size="small">Available Tags</Text>
          <TagList
            tags={tags}
            onClick={(tag: string) => {
              insertTag(tag)
            }}
          />
        </div>
      </RouteFocusModal.Body>
    </RouteFocusModal>
  )
}
